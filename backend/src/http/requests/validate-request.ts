import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }

      console.error("Validation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
