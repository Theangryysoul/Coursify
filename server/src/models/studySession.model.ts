import { Schema, model } from "mongoose";

const studySessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
    },

    watchedSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

studySessionSchema.index(
  {
    user: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export default model(
  "StudySession",
  studySessionSchema
);