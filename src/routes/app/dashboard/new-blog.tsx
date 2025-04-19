import { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../../lib/supabase/client";

export const NewBlogPage = () => {
  const supabase = createClient();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const categories = [
    { value: "Šou program", label: "Šou program" },
    { value: "Hercul", label: "Hercul" },
    { value: "FINTUR", label: "FINTUR" },
    { value: "Una Corda", label: "Una Corda" },
    { value: "CompetIT", label: "CompetIT" },
    { value: "ISHA", label: "ISHA" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("blog-images") // Your bucket name
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const createBlogMutation = useMutation({
    mutationFn: async (formData: {
      title: string;
      description: string;
      image_url: string;
      image_alt: string;
      category: string;
      content: string;
      hashtags: string[];
    }) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert([{ ...formData, author: "Ja" }])
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      // toast.success("Blog created successfully!");
      location.href = "/dashboard/blogs";
    },
    onError: (error) => {
      // toast.error("Failed to create blog");
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image_alt = formData.get("alt-text") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const hashtags = (formData.get("hashtags") as string)
      .split(",")
      .map((tag) => tag.trim());

    try {
      let image_url = "";
      if (selectedFile) {
        image_url = await uploadImage(selectedFile);
      }

      await createBlogMutation.mutateAsync({
        title,
        description,
        image_url,
        image_alt,
        category,
        content,
        hashtags,
      });
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="">
          <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a short description"
                rows={3}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex flex-col gap-4">
                <div className="w-48 h-48 bg-muted rounded-md flex items-center justify-center">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Preview
                    </span>
                  )}
                </div>
                <div className="w-fit">
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    name="image"
                  />
                  <Button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full bg-foreground"
                  >
                    Upload Image
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended size: 1200x630px
                  </p>
                </div>
              </div>
            </div>

            {/* Image Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="alt-text">Image Alt Text</Label>
              <Input
                id="alt-text"
                name="alt-text"
                placeholder="Describe the image for accessibility"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog content here..."
                rows={10}
                required
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                name="hashtags"
                placeholder="Add comma separated tags (e.g., tech, web, design)"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={createBlogMutation.isPending}>
                {createBlogMutation.isPending
                  ? "Publishing..."
                  : "Publish Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
