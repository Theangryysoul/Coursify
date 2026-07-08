import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getLearningStatsController, getResumeController, updateProgressController } from "../controllers/progress.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProgressSchema } from "../validators/progress.validator.js";


const router = Router();

router.get(
  "/stats",
  authenticate,
  getLearningStatsController
);

router.get(
  "/:videoId",
  authenticate,
  getResumeController
);

router.patch(
  "/:videoId",
  authenticate,
  validate(updateProgressSchema),
  updateProgressController
);

export default router;