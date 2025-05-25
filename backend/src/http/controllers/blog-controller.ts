import { Request, Response } from "express";
import { Blog } from "../../models/Blog";
import { deleteBlog } from "../../utils/blog-utils";
import {
  BlogDestroySchema,
  BlogIndexSchema,
  BlogStoreSchema,
} from "../requests/blog-request";

export class BlogController {
  static async index(req: Request, res: Response) {
    try {
      const {
        query: { search, page, per_page },
      } = BlogIndexSchema.parse(req);

      const result = search
        ? await Blog.search(search as string, page, per_page)
        : await Blog.all(page, per_page);

      res.status(200).json({
        data: result.data,
        meta: { pagination: result.pagination },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      const { body: blogData } = BlogStoreSchema.parse(req);

      // @ts-ignore
      const userId = req.user?.id as string;

      // const imageUrl = await uploadBlogImage(req.file!);
      // const createdBlog = await createBlogPost(blogData, imageUrl, userId);

      // await notifyUsersAboutNewBlog(createdBlog);

      res.status(201).json({
        message: "Blog created successfully",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const {
        params: { id },
      } = BlogDestroySchema.parse(req);

      const isDeleted = await deleteBlog(id);

      if (!isDeleted) {
        res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
