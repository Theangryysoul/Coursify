import WatchProgress from "../models/watchProgress.model.js";
import UserCourse from "../models/userCourse.model.js";
import Video from "../models/video.model.js";
import { NotFoundError } from "../utils/errors.js";
import Course from "../models/course.model.js";
import StudySession from "../models/studySession.model.js";

export const getResume = async (
  userId: string,
  youtubeVideoId: string
) => {
  const video = await Video.findOne({
    videoId: youtubeVideoId,
  });

  if (!video) {
    throw new NotFoundError("Video not found");
  }

  const userCourse = await UserCourse.findOne({
    owner: userId,
    course: video.course,
  });

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }

  const progress = await WatchProgress.findOne({
    userCourse: userCourse._id,
    video: video._id, // MongoDB ObjectId
  });

  if (!progress) {
    return {
      currentTime: 0,
      completed: false,
      watchedSegments: [],
    };
  }

  return progress;
};

const mergeSegments = (
  segments: { start: number; end: number }[]
) => {
  if (!segments.length) return [];

  const sorted = [...segments].sort(
    (a, b) => a.start - b.start
  );

  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
};

const calculateUniqueSeconds = (
  segments: { start: number; end: number }[]
) => {
  return segments.reduce(
    (total, segment) =>
      total + (segment.end - segment.start),
    0
  );
};

export const calculateCourseProgress = async (
  userCourseId: string
) => {
  const progresses = await WatchProgress.find({
    userCourse: userCourseId,
  });

  if (progresses.length === 0) {
    return 0;
  }

  const completedVideos = progresses.filter(
    (progress) => progress.completed
  ).length;

  return Math.round(
    (completedVideos / progresses.length) * 100
  );
};

export const updateProgress = async (
  userId: string,
  youtubeVideoId: string,
  data: {
    currentTime: number;
    duration: number;
    segment: {
      start: number;
      end: number;
    };
  }
) => {  
    const video = await Video.findOne({
    videoId: youtubeVideoId,
  });

  if (!video) {
    throw new NotFoundError("Video not found");
  }

  const userCourse = await UserCourse.findOne({
    owner: userId,
    course: video.course,
  });

  if (!userCourse) {
    throw new NotFoundError("Course not found");
  }  
  let progress = await WatchProgress.findOne({
    userCourse: userCourse._id,
    video: video._id,
  });

  if (!progress) {
    progress = await WatchProgress.create({
      userCourse: userCourse._id,
      video: video._id,
    });
  }
    const mergedSegments = mergeSegments([
    ...progress.watchedSegments,
    data.segment,
  ]);

  const uniqueSeconds =
    calculateUniqueSeconds(mergedSegments);

    progress.currentTime = data.currentTime;
    progress.watchedSegments = mergedSegments as any;
    progress.uniqueWatchedSeconds = uniqueSeconds;
    progress.lastWatchedAt = new Date();

    progress.completed =
        uniqueSeconds >= data.duration * 0.95;

      await progress.save();
      await updateStudySession(
        userId,
        data.segment.end - data.segment.start
        );
      await updateCourseProgress(
        userCourse._id.toString()
        );

  return progress;
};

const updateCourseProgress = async (
  userCourseId: string
) => {
  const progresses = await WatchProgress.find({
    userCourse: userCourseId,
  });

  const total = progresses.length;

  const completed = progresses.filter(
    (p) => p.completed
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  await UserCourse.findByIdAndUpdate(
    userCourseId,
    {
      progress,
    }
  );
};

export const getLearningStats = async (
  userId: string
) => {
  const userCourses = await UserCourse.find({
    owner: userId,
    archived: false,
  });

  const userCourseIds = userCourses.map(
    (course) => course._id
  );

  const progresses = await WatchProgress.find({
    userCourse: {
      $in: userCourseIds,
    },
  });

  const totalCourses = userCourses.length;

  const completedVideos = progresses.filter(
    (progress) => progress.completed
  ).length;

  const totalWatchTime = progresses.reduce(
    (total, progress) =>
      total + progress.uniqueWatchedSeconds,
    0
  );

  const streak = await calculateStudyStreak(
    userId
    );

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
    };

  return {
    totalCourses,
    completedVideos,
    totalWatchTime,
    streak,
    formattedWatchTime: formatWatchTime(totalWatchTime),
  };
};

const updateStudySession = async (
  userId: string,
  watchedSeconds: number
) => {
  const today = new Date().toISOString().split("T")[0];

  await StudySession.findOneAndUpdate(
    {
      user: userId,
      date: today,
    },
    {
      $inc: {
        watchedSeconds,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
};

export const calculateStudyStreak = async (
  userId: string
) => {
  const sessions = await StudySession.find({
    user: userId,
  }).sort({
    date: -1,
  });

  if (!sessions.length) {
    return 0;
  }

  let streak = 0;

  let current = new Date();

  for (const session of sessions) {
    const expected = current
      .toISOString()
      .split("T")[0];

    if (session.date !== expected) {
      break;
    }

    streak++;

    current.setDate(
      current.getDate() - 1
    );
  }

  return streak;
};