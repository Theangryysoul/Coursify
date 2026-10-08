import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      // Google accounts never set a password, so it is only required for
      // users who signed up with an email address.
      required: function (this: { googleId?: string }) {
        return !this.googleId;
      },
      select: false,
    },

    // Set for accounts created through Google Sign-In. Sparse so the many
    // password-only accounts do not collide on a null value.
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;