import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCourseByIdController, getMyCoursesController, updateCourseController } from "../controllers/course.controller.js";

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

export default router;