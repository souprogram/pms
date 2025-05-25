import { Router } from "express";
import { BlogController } from "../http/controllers/blog-controller";
import {
  BlogIndexSchema,
  BlogStoreSchema,
  upload as blogUpload,
} from "../http/requests/blog-request";
import { validateRequest } from "../http/requests/validate-request";
import { authenticate } from "../middlewares/auth-middleware";

const router = Router();

router.get("/blogs", validateRequest(BlogIndexSchema), BlogController.index);
router.post(
  "/blogs",
  [authenticate, blogUpload.single("image"), validateRequest(BlogStoreSchema)],
  BlogController.store
);
router.delete("/blogs/:id", [authenticate], BlogController.destroy);

export const apiRoutes = router;
