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
import { useRef, useState } from "react";

export const NewBlogPage = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4">
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter blog title" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a short description"
              rows={3}
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
                  <span className="text-sm text-muted-foreground">Preview</span>
                )}
              </div>
              <div className="w-fit">
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer hidden"
                  onChange={handleImageChange}
                  ref={fileInputRef}
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
              placeholder="Describe the image for accessibility"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
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
              placeholder="Write your blog content here..."
              rows={10}
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              placeholder="Add comma separated tags (e.g., tech, web, design)"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button>Publish Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
