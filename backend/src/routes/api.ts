import { Router } from "express";
import { BlogController } from "../http/controllers/blog-controller";
import { upload as blogUpload } from "../http/requests/blog-request";
import { auth, authorizeAuthor } from "../middlewares";

const router = Router();

router.get("/blogs", BlogController.index);

router.post(
  "/blogs",
  [auth, authorizeAuthor, blogUpload.single("image")],
  BlogController.store
);

router.patch(
  "/blogs/:id",
  [auth, authorizeAuthor, blogUpload.single("image")],
  BlogController.update
);

router.delete("/blogs/:id", [auth, authorizeAuthor], BlogController.destroy);

export const apiRoutes = router;
