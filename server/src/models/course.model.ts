import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["playlist", "single-video"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      required: true,
    },

    channelName: {
      type: String,
      required: true,
    },

    channelId: {
      type: String,
      default: null,
    },

    playlistId: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    videoId: {
      type: String,
      unique: true,
      sparse: true,
    },

    playlistUrl: {
      type: String,
      required: true,
    },

    videoCount: {
      type: Number,
      default: 1,
    },

    totalDuration: {
      type: Number,
      default: 0,
    },

    importSource: {
      type: String,
      default: "youtube",
    },

    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);

export default model("Course", courseSchema);