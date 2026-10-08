import UserCourse from "../models/userCourse.model.js";
import Video from "../models/video.model.js";
import Course from "../models/course.model.js";
import Folder from "../models/folder.model.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
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

    const course = userCourse.course as any;

    return {
      ...userCourse.toObject(),

      // The client renders "completed / total videos" per course card. The
      // stored field is `videoCount`, so it is exposed under the names the
      // client reads instead of leaving them undefined in the UI.
      course: course
        ? {
            ...course.toObject(),
            totalVideos: course.videoCount ?? 0,
            completedVideos: progress.completedVideos,
          }
        : null,

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

/**
 * Returns the folder only if it belongs to the caller.
 *
 * Without this check a user could file their course into somebody else's
 * folder - or, worse, write an arbitrary id into their own record and have the
 * sidebar render a folder they do not own.
 */
const assertFolderIsOwned = async (
  userId: string,
  folderId: string
) => {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
  });

  if (!folder) {
    throw new BadRequestError("Folder not found");
  }

  return folder;
};

export const setCourseFolder = async (
  userId: string,
  courseId: string,
  folderId: string | null
) => {
  if (folderId) {
    await assertFolderIsOwned(userId, folderId);
  }

  const userCourse = await UserCourse.findOneAndUpdate(
    {
      owner: userId,
      course: courseId,
    },
    {
      $set: {
        folder: folderId ?? null,
      },
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

/**
 * Removes a course from the caller's library.
 *
 * A Course document is shared: two users who import the same playlist point at
 * one row, and deleting it outright would delete the other user's course too.
 * So the user's own UserCourse and its watch history go first, and the shared
 * course and its videos are only collected once nobody else references them.
 */
export const deleteCourse = async (
  userId: string,
  courseId: string
) => {
  const userCourse = await UserCourse.findOne({
    owner: userId,
    course: courseId,
  });

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }

  await WatchProgress.deleteMany({
    userCourse: userCourse._id,
  });

  await userCourse.deleteOne();

  const remainingOwners = await UserCourse.countDocuments({
    course: courseId,
  });

  if (remainingOwners === 0) {
    await Video.deleteMany({
      course: courseId,
    });

    await Course.findByIdAndDelete(courseId);
  }

  return {
    courseId,
  };
};