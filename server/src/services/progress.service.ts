import WatchProgress from "../models/watchProgress.model.js";
import UserCourse from "../models/userCourse.model.js";
import Video from "../models/video.model.js";
import { NotFoundError } from "../utils/errors.js";
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
    video: video._id,
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
  const userCourse = await UserCourse.findById(
    userCourseId
  ).populate("course");

  if (!userCourse) {
    return {
      percentage: 0,
      watchedDuration: 0,
      totalDuration: 0,
    };
  }

  const progresses = await WatchProgress.find({
    userCourse: userCourseId,
  });

  const watchedDuration = progresses.reduce(
    (total, progress) =>
      total + progress.uniqueWatchedSeconds,
    0
  );

  const totalDuration = (
    userCourse.course as any
  ).totalDuration;

  if (!totalDuration) {
    return {
      percentage: 0,
      watchedDuration,
      totalDuration: 0,
    };
  }

  return {
    percentage: Math.min(
      100,
      Math.round(
        (watchedDuration /
          totalDuration) *
          100
      )
    ),
    watchedDuration,
    totalDuration,
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
      expectedNextSecond: 0,
    });
  }

const segmentLength =
  data.segment.end - data.segment.start;

// Reject impossible segments
if (
  segmentLength <= 0 ||
  segmentLength > 8
) {
  return progress;
}

const tolerance = 10;

const diff =
  data.segment.start -
  progress.expectedNextSecond;

// User jumped forward more than 10s.
// Don't count skipped part, but resume tracking
// from the new position.
if (
  !progress.completed &&
  diff > tolerance
) {
  progress.currentTime = data.currentTime;
  progress.expectedNextSecond =
    data.segment.start;
  progress.lastWatchedAt = new Date();

  await progress.save();
  

  await UserCourse.findByIdAndUpdate(
    userCourse._id,
    {
      $currentDate: {
        updatedAt: true,
      },
    }
  );

  return progress;
}

    const mergedSegments = mergeSegments([
    ...progress.watchedSegments,
    data.segment,
  ]);

  const uniqueSeconds =
    calculateUniqueSeconds(mergedSegments);

const previousUniqueSeconds =
  progress.uniqueWatchedSeconds;

  const newlyWatched =
    uniqueSeconds -
    previousUniqueSeconds;

  progress.currentTime = data.currentTime;
  progress.expectedNextSecond =
    data.segment.end;
  progress.watchedSegments =
    mergedSegments as any;
  progress.uniqueWatchedSeconds =
    uniqueSeconds;
  progress.lastWatchedAt =
    new Date();

    const wasCompleted = progress.completed;

    progress.completed =
      uniqueSeconds >= data.duration * 0.95;

    if (!wasCompleted && progress.completed) {
      progress.currentTime = data.duration;

      // Reset so replay starts from beginning
      progress.expectedNextSecond = 0;
    }

      await progress.save();

    if (newlyWatched > 0) {
      await updateStudySession(
        userId,
        newlyWatched
      );
    }

      await UserCourse.findByIdAndUpdate(
        userCourse._id,
        {
          $currentDate: {
            updatedAt: true,
          },
        }
      );

    await updateCourseProgress(
      userCourse._id.toString()
    );

    const totalVideos = await Video.countDocuments({
      course: video.course,
    });

    const completedVideos = await WatchProgress.countDocuments({
      userCourse: userCourse._id,
      completed: true,
    });

    await UserCourse.findByIdAndUpdate(
      userCourse._id,
      {
        status:
          completedVideos === 0
            ? "Not Started"
            : completedVideos === totalVideos
            ? "Completed"
            : "In Progress",
      }
    );

    return progress;
};

export const toggleCompleted = async (
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

  progress.completed = !progress.completed;

  await progress.save();

  const totalVideos = await Video.countDocuments({
    course: video.course,
  });

  const completedVideos =
    await WatchProgress.countDocuments({
      userCourse: userCourse._id,
      completed: true,
    });

  await UserCourse.findByIdAndUpdate(
    userCourse._id,
    {
      status:
        completedVideos === 0
          ? "Not Started"
          : completedVideos === totalVideos
          ? "Completed"
          : "In Progress",
    }
  );

  return progress;
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

export const getHeatmapData = async (
  userId: string
) => {
  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() - 364);

  const sessions = await StudySession.find({
    user: userId,
    date: {
      $gte: start
        .toISOString()
        .split("T")[0],
    },
  }).lean();

  const sessionMap = new Map(
    sessions.map((session) => [
      session.date,
      session.watchedSeconds,
    ])
  );

  const data = [];

  for (
    let d = new Date(start);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    const date = d
      .toISOString()
      .split("T")[0];

    const seconds =
      sessionMap.get(date) ?? 0;

    let level = 0;

    if (seconds >= 3 * 3600) {
      level = 4;
    } else if (seconds >= 2 * 3600) {
      level = 3;
    } else if (seconds >= 3600) {
      level = 2;
    } else if (seconds > 0) {
      level = 1;
    }

    data.push({
      date,
      watchedSeconds: seconds,
      level,
    });
  }

  return data;
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