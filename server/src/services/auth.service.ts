import bcrypt from "bcrypt";
import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import { RegisterUserInput, LoginUserInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { BadRequestError, NotFoundError, UnauthorizedError, } from "../utils/errors.js";

/**
 * Everything the client is allowed to know about a user.
 *
 * Never send a user document straight from Mongoose: `select: false` only
 * affects queries, so a document returned by `User.create()` still holds the
 * bcrypt hash in memory and would serialize it into the response.
 */
export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const sanitizeUser = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  avatar?: { url?: string; publicId?: string } | null;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): PublicUser => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: {
    url: user.avatar?.url ?? "",
    publicId: user.avatar?.publicId ?? "",
  },
  bio: user.bio ?? "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (userData: RegisterUserInput) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return createSession(sanitizeUser(user), user._id.toString());
};

export const loginUser = async (
  userData: LoginUserInput
) => {

  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
  throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return createSession(sanitizeUser(user), user._id.toString());

};

export const changePassword =
  async (
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) => {
    const user =
      await User.findById(userId).select("+password");

    if (!user) {
      throw new NotFoundError(
        "User not found"
      );
    }

    const valid =
      await bcrypt.compare(
        data.currentPassword,
        user.password
      );

    if (!valid) {
      throw new UnauthorizedError(
        "Current password is incorrect"
      );
    }

    user.password = await bcrypt.hash(
      data.newPassword,
      10
    );

    await user.save();

    return;
  };

export const refreshAccessToken = async (
  refreshToken: string
) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(
      "Invalid or expired refresh token"
    );
  }

  // The refresh token is only proof of identity; the profile is re-read so the
  // client can restore the whole session from a page reload.
  const user = await getCurrentUserService(decoded.userId);

  return {
    user,
    accessToken: generateAccessToken(decoded.userId),
  };
};

export const getCurrentUserService = async (
  userId: string
) => {
  if (!isValidObjectId(userId)) {
    throw new UnauthorizedError("Invalid session");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return sanitizeUser(user);
};

const createSession = (user: PublicUser, userId: string) => ({
  user,
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});
