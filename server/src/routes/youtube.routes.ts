import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { youtubeUrlSchema } from "../validators/youtube.validator.js";
import { previewYoutubeController } from "../controllers/youtube.controller.js";

const router = Router();

router.post(
  "/preview",
  authenticate,
  validate(youtubeUrlSchema),
  previewYoutubeController
);

export default router;