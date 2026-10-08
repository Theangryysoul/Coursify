import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { assignFolderSchema } from "../validators/folder.validator.js";
import {
  assignCourseFolderController,
  deleteCourseController,
  getCourseByIdController,
  getMyCoursesController,
  updateCourseController,
} from "../controllers/course.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getMyCoursesController
);

router.get(
  "/:id",
  authenticate,
  getCourseByIdController
);

router.patch(
  "/:id",
  authenticate,
  updateCourseController
);

// Files the course into a folder. A null folderId moves it back to
// "Uncategorised".
router.patch(
  "/:id/folder",
  authenticate,
  validate(assignFolderSchema),
  assignCourseFolderController
);

// Removes the course from the caller's library (and collects the shared
// course document once nobody else references it).
router.delete(
  "/:id",
  authenticate,
  deleteCourseController
);

export default router;
