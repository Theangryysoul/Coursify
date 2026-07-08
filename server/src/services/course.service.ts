import UserCourse from "../models/userCourse.model.js";
import Video from "../models/video.model.js";
import { NotFoundError } from "../utils/errors.js";

export const getMyCourses = async (userId: string) => {
  const userCourses = await UserCourse.find({
    owner: userId,
    archived: false,
  })
    .populate("course")
    .sort({
      pinned: -1,
      updatedAt: -1,
    });

  return userCourses;
};

export const getCourseById = async (
  userId: string,
  courseId: string
) => {
  const userCourse = await UserCourse.findOne({
    owner: userId,
    course: courseId,
  }).populate("course");

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }

  const videos = await Video.find({
    course: courseId,
  }).sort({
    position: 1,
  });

  return {
    userCourse,
    videos,
  };
};

export const updateCourse = async (
  userId: string,
  courseId: string,
  data: Partial<{
    favorite: boolean;
    pinned: boolean;
    archived: boolean;
    status: string;
  }>
) => {
  const userCourse = await UserCourse.findOneAndUpdate(
    {
      owner: userId,
      course: courseId,
    },
    {
      $set: data,
    },
    {
      new: true,
    }
  ).populate("course");

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }

  return userCourse;
};