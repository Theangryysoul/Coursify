import User from "../models/user.model.js";
import { NotFoundError } from "../utils/errors.js";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateAvatar = async (
  userId: string,
  avatar: {
    url: string;
    publicId: string;
  }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: {
    name?: string;
    bio?: string;
  }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
