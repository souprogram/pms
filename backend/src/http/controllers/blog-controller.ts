import assert from "assert";
import { Response } from "express";
import path from "path";
import { emailService } from "../../lib/email";
import { supabase } from "../../lib/supabase";
import { AuthRequest } from "../../types/auth-request";
import { renderTemplate } from "../../utils/render-template";
import {
  BlogDestroySchema,
  BlogStoreSchema,
  BlogUpdateSchema,
} from "../requests/blog-request";

export class BlogController {
  static async index(req: AuthRequest, res: Response) {}

  static async store(req: AuthRequest, res: Response) {
    try {
      // Validate the request
      const user = req.user;
      assert(user, "User must be authenticated");

      const { body: newBlog } = BlogStoreSchema.parse(req);

      const file = req.file;
      assert(file, "Image file is required");

      // Upload the image to storage
      const fileExt = path.extname(file.originalname);
      const fileName = `${Date.now()}${fileExt}`;
      const storagePath = `blogs/${user.id}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from("blog-images")
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(storagePath);

      // Add the new blog
      const { data: blogData } = await supabase
        .from("blogs")
        .insert({
          ...newBlog,
          image_url: urlData.publicUrl,
          author_id: user.id,
        })
        .select()
        .single()
        .throwOnError();

      // Send email to all subscribed users
      const { data: usersData } = await supabase
        .rpc("get_all_user_profiles")
        .eq("is_subscribed", true)
        .select("email, is_subscribed")
        .throwOnError();

      const blogUrl = `${process.env.FRONTEND_URL}/blogs/${blogData.id}`;

      const html = renderTemplate("template", {
        title: blogData.title,
        description: blogData.description,
        blogUrl,
      });

      const emailSentResult = await Promise.allSettled(
        usersData.map((user) =>
          emailService.sendMail({
            from: `Pulska mreža studenata <${process.env.EMAIL_USER}>`,
            to: String(user.email),
            subject: `PMS objava: ${blogData.title}`,
            html,
          })
        )
      );

      if (emailSentResult.some((result) => result.status === "rejected"))
        throw new Error("Failed to send emails to some subscribers");

      res.status(201).json({
        message: "Blog created successfully and mails sent to subscribers",
        blog: blogData,
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog" });
      return;
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      // Validate the request
      const user = req.user;
      assert(user, "User must be authenticated");

      const { body: updatedBlog, params } = BlogUpdateSchema.parse(req);

      const file = req.file;
      assert(file, "Image file is required");

      // Check if the blog exists and the user is the author
      const { data: oldBlogData } = await supabase
        .from("blogs")
        .select("author_id, image_url")
        .eq("id", params.id)
        .single()
        .throwOnError();

      if (oldBlogData.author_id !== user.id) {
        res.status(403).json({ error: "You are not the author of this blog" });
        return;
      }

      // Delete old image from storage
      const oldStoragePath = oldBlogData.image_url
        .split("/")
        .slice(-2)
        .join("/");

      const { error: deleteError } = await supabase.storage
        .from("blog-images")
        .remove([oldStoragePath]);

      if (deleteError) throw deleteError;

      // Upload new image
      const fileExt = path.extname(file.originalname);
      const fileName = `${Date.now()}${fileExt}`;
      const storagePath = `blogs/${user.id}/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from("blog-images")
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (storageError) throw storageError;

      // Update the blog
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(storagePath);

      const { data: blogData } = await supabase
        .from("blogs")
        .update({ ...updatedBlog, image_url: urlData.publicUrl })
        .eq("id", params.id)
        .single()
        .throwOnError();

      res.status(200).json({
        message: "Blog updated successfully",
        blog: blogData,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  }

  static async destroy(req: AuthRequest, res: Response) {
    try {
      // Validate the request
      const user = req.user;
      assert(user, "User must be authenticated");

      const { params } = BlogDestroySchema.parse(req);

      // Check if the blog exists and the user is the author
      const { data: blogData } = await supabase
        .from("blogs")
        .select("image_url, author_id")
        .eq("id", params.id)
        .single()
        .throwOnError();

      if (blogData.author_id !== user.id) {
        res.status(403).json({ error: "You are not the author of this blog" });
        return;
      }

      // Delete the image from storage
      const storagePath = blogData.image_url.split("/").slice(-2).join("/");
      const { error: deleteError } = await supabase.storage
        .from("blog-images")
        .remove([storagePath]);

      if (deleteError) throw deleteError;

      // Delete the blog
      await supabase.from("blogs").delete().eq("id", params.id).throwOnError();

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  }
}
