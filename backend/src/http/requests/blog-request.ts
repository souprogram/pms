import multer from "multer";
import { z } from "zod";

export const BlogIndexSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    per_page: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(10),
  }),
});

export const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File type must be JPEG, PNG, or WEBP"));
    }
    cb(null, true);
  },
});

export const BlogStoreSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    image_alt: z.string(),
    category: z.string(),
    content: z.string(),
    author: z.string(),
    hashtags: z.string().transform((val) => {
      return val
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }),
  }),
});

export const BlogUpdateSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title: z.string(),
    description: z.string(),
    image_alt: z.string(),
    category: z.string(),
    content: z.string(),
    hashtags: z.string().transform((val) => {
      return val
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }),
  }),
});

export const BlogDestroySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
