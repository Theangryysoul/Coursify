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

    // Which folder the course sits in. `null` means it is uncategorised, which
    // is what every pre-existing row becomes - so no migration is needed.
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
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