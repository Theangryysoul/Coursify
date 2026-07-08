import { Schema, model } from "mongoose";

const userCourseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Archived",
      ],
      default: "Not Started",
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userCourseSchema.index(
  {
    owner: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

export default model("UserCourse", userCourseSchema);