import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import {
  getMyCourses,
  getCourseById,
} from "../services/course.service.js";
import { updateCourse } from "../services/course.service.js";

export const getMyCoursesController = asyncHandler(
  async (req: Request, res: Response) => {
    const courses = await getMyCourses(req.user.userId);

    return successResponse(
      res,
      "Courses fetched successfully",
      courses
    );
  }
);

export const getCourseByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await getCourseById(
      req.user.userId,
      req.params.id as string
    );

    return successResponse(
      res,
      "Course fetched successfully",
      course
    );
  }
);

export const updateCourseController = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await updateCourse(
      req.user.userId,
      req.params.id as string,
      req.body
    );

    return successResponse(
      res,
      "Course updated successfully",
      course
    );
  }
);