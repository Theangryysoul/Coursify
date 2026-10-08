import { Schema, model } from "mongoose";

const folderSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    // A short colour token ("violet", "blue", ...) the client maps to a real
    // colour. Storing the token keeps theming decisions in the UI.
    color: {
      type: String,
      default: "violet",
    },
  },
  {
    timestamps: true,
  }
);

// Two folders with the same name under one account would be indistinguishable
// in the sidebar, so the name is unique per owner.
folderSchema.index(
  {
    owner: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default model("Folder", folderSchema);
