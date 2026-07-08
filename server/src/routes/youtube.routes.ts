import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { youtubeUrlSchema } from "../validators/youtube.validator.js";
import { importYoutubeController, previewYoutubeController } from "../controllers/youtube.controller.js";

const router = Router();

router.post(
  "/preview",
  authenticate,
  validate(youtubeUrlSchema),
  previewYoutubeController
);

router.post(
  "/import",
  authenticate,
  validate(youtubeUrlSchema),
  importYoutubeController
);

export default router;