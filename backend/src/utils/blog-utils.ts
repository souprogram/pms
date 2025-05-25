import dotenv from "dotenv";
dotenv.config();

import { env } from "../environment";
import { supabase } from "../lib/supabase";
import { emailService } from "../services/email-service";
import { Blog } from "../types/blog";

type BlogPure = Omit<
  Blog,
  "id" | "created_at" | "updated_at" | "author" | "author_id" | "image_url"
>;

export const uploadBlogImage = async (image: Express.Multer.File) => {
  const fileExtension = image.originalname.split(".").pop();
  const filename = `${image.originalname.replace(" ", "-")}_${Date.now()}.${fileExtension}`;

  const { data: imageData, error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(filename, image.buffer, {
      contentType: image.mimetype,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw new Error("Error uploading image");
  }

  const imageUrl = supabase.storage
    .from("blog-images")
    .getPublicUrl(imageData.path).data.publicUrl;

  return imageUrl;
};

export const createBlogPost = async (
  blog: BlogPure,
  imageUrl: string,
  userId: string
) => {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    throw new Error("Error fetching user profile");
  }

  const { data: blogData, error: blogError } = await supabase
    .from("blogs")
    .insert({
      ...blog,
      image_url: imageUrl,
      author_id: profileData.id,
      author: profileData.full_name,
    })
    .select()
    .single();

  if (blogError) {
    console.log("Error creating blog:", blogError);
    throw new Error("Error creating blog");
  }

  return blogData;
};

export const deleteBlog = async (id: number) => {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Error deleting blog");
  }

  return true;
};

export const updateBlog = async (id: number, blog: BlogPure) => {
  const { data: blogData, error: blogError } = await supabase
    .from("blogs")
    .update(blog)
    .eq("id", id)
    .select()
    .single();

  if (blogError) {
    console.log("Error updating blog:", blogError);
    throw new Error("Error updating blog");
  }

  return blogData;
};

export const notifyUsersAboutNewBlog = async (blog: Blog) => {
  try {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("is_subscribed", true);

    if (error || !users) {
      console.error("Error fetching users:", error);
      return;
    }

    const emailPromises = users.map(async (user) => {
      if (user.email) {
        await emailService.sendMail({
          from: `"Blog Platform" <${env.emailUser}>`,
          to: user.email,
          subject: `New Blog Post: ${blog.title}`,
          html: `
            <h1>${blog.title}</h1>
            <p>${blog.description}</p>
            <p>Posted by: ${blog.author}</p>
            <a href="${process.env.FRONTEND_URL}/blogs/${blog.id}">Read more</a>
          `,
        });
      }
    });

    await Promise.all(emailPromises);
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
};
