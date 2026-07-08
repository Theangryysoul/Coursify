import { Schema, model } from "mongoose";

const videoSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    videoId: {
      type: String,
      required: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ course: 1, position: 1 });

export default model("Video", videoSchema);