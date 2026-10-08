import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { youtubeRateLimit } from "../middleware/rate-limit.middleware.js";
import { youtubeUrlSchema } from "../validators/youtube.validator.js";
import { importYoutubeController, previewYoutubeController } from "../controllers/youtube.controller.js";

const router = Router();

// authenticate runs first so the limiter can key on the account rather than
// the IP address.
router.post(
  "/preview",
  authenticate,
  youtubeRateLimit,
  validate(youtubeUrlSchema),
  previewYoutubeController
);

router.post(
  "/import",
  authenticate,
  youtubeRateLimit,
  validate(youtubeUrlSchema),
  importYoutubeController
);

export default router;
