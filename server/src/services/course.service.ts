import UserCourse from "../models/userCourse.model.js";
import Video from "../models/video.model.js";
import { NotFoundError } from "../utils/errors.js";
import { calculateCourseProgress } from "./progress.service.js";
import WatchProgress from "../models/watchProgress.model.js";

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

  const courses = await Promise.all(
  userCourses.map(async (userCourse) => {
    const progress = await calculateCourseProgress(
      userCourse._id.toString()
    );

    return {
      ...userCourse.toObject(),
      progress,
    };
  })
);

return courses;
};

export const getCourseById = async (
  userId: string,
  courseId: string
) => {
  const userCourse = await UserCourse.findOne({
    owner: userId,
    course: courseId,
  }).populate("course").lean();

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }

  const videos = await Video.find({
    course: courseId,
  })
    .sort({
      position: 1,
    })
    .lean();

  const progresses = await WatchProgress.find({
    userCourse: userCourse._id,
  }).lean();

  const progressMap = new Map(
    progresses.map((progress) => [
      progress.video.toString(),
      progress,
    ])
  );

  const enrichedVideos = videos.map((video) => {
    const progress = progressMap.get(
      video._id.toString()
    );

    return {
      ...video,
      completed: progress?.completed ?? false,
      currentTime: progress?.currentTime ?? 0,
    };
  });

  const progress = await calculateCourseProgress(
  userCourse._id.toString()
  );

  const lastProgress = await WatchProgress.findOne({
    userCourse: userCourse._id,
  })
    .sort({
      lastWatchedAt: -1,
    })
    .lean();

  return {
    userCourse,
    progress,
    videos: enrichedVideos,

    resume: lastProgress
      ? {
          videoId: lastProgress.video.toString(),
          currentTime:
            lastProgress.currentTime,
        }
      : null,
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