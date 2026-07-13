import { Schema, model } from "mongoose";

const watchedSegmentSchema = new Schema(
  {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const watchProgressSchema = new Schema(
  {
    userCourse: {
      type: Schema.Types.ObjectId,
      ref: "UserCourse",
      required: true,
      index: true,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },

    currentTime: {
      type: Number,
      default: 0,
    },

    expectedNextSecond: {
      type: Number,
      default: 0,
    },

    watchedSegments: {
      type: [watchedSegmentSchema],
      default: [],
    },

    uniqueWatchedSeconds: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

watchProgressSchema.index(
  {
    userCourse: 1,
    video: 1,
  },
  {
    unique: true,
  }
);

export default model(
  "WatchProgress",
  watchProgressSchema
);