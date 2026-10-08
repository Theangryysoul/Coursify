import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import { NotFoundError } from "../utils/errors.js";
import {
  deleteCourse,
  getMyCourses,
  getCourseById,
  setCourseFolder,
  updateCourse,
} from "../services/course.service.js";

/**
 * A malformed id otherwise reaches Mongoose and surfaces as a CastError, which
 * the global handler reports as a 500 for what is really a missing resource.
 */
const requireValidCourseId = (value: unknown) => {
  if (typeof value !== "string" || !isValidObjectId(value)) {
    throw new NotFoundError("Course not found");
  }

  return value;
};

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
      requireValidCourseId(req.params.id)
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
      requireValidCourseId(req.params.id),
      req.body
    );

    return successResponse(
      res,
      "Course updated successfully",
      course
    );
  }
);

export const assignCourseFolderController = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await setCourseFolder(
      req.user.userId,
      requireValidCourseId(req.params.id),
      req.body.folderId ?? null
    );

    return successResponse(
      res,
      "Course moved successfully",
      course
    );
  }
);

export const deleteCourseController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteCourse(
      req.user.userId,
      requireValidCourseId(req.params.id)
    );

    return successResponse(res, "Course removed successfully");
  }
);
