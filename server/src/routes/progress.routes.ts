import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getLearningStatsController,
  getResumeController,
  updateProgressController,
  toggleCompletedController,
  getHeatmapController,
} from "../controllers/progress.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProgressSchema } from "../validators/progress.validator.js";


const router = Router();

router.get(
  "/stats",
  authenticate,
  getLearningStatsController
);

router.get(
  "/heatmap",
  authenticate,
  getHeatmapController
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

router.patch(
  "/:videoId/toggle",
  authenticate,
  toggleCompletedController
);

export default router;