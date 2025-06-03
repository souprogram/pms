import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { TiptapEditor } from "../../../components/app/tiptap-editor";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { useCreateBlog } from "../../../hooks/use-create-blog";

export default function NewBlogPage() {
  const navigate = useNavigate();
  const createBlog = useCreateBlog();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [createMore, setCreateMore] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    await createBlog.mutateAsync(
      {
        title: formData.get("title")?.toString() ?? "",
        description: formData.get("description")?.toString() ?? "",
        image: formData.get("image") as File | null,
        image_alt: formData.get("image_alt")?.toString() ?? "",
        category: formData.get("category")?.toString() ?? "",
        hashtags: formData.get("hashtags")?.toString() ?? "",
        content,
        send_mail: formData.get("send-mail") === "on",
      },
      {
        onSuccess: () => {
          if (createMore) return;
          navigate("/dashboard");
        },
      },
    );
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="">
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
                <div className="w-80 h-45 bg-muted rounded-md flex items-center justify-center">
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
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-foreground"
                  >
                    Upload Image
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Preporučena veličina: 1280x720px
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Udruga</Label>
              <Select name="category">
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
              <Label>Content</Label>
              <TiptapEditor onChange={setContent} />
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

            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <Checkbox id="send-mail" />
                <Label htmlFor="send-mail">
                  Pošalji svim korisnicima na email
                </Label>
              </div>

              <div className="flex items-center gap-x-2">
                <Checkbox
                  id="create-more"
                  defaultChecked={createMore}
                  onChange={() => setCreateMore((prev) => !prev)}
                />
                <Label htmlFor="create-more">
                  Kreiraj još jedan post{" "}
                  <span className="text-muted-foreground">
                    (Ostani na ovoj stranici)
                  </span>
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={createBlog.isPending}>
                {createBlog.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
