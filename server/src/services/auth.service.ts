import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { RegisterUserInput, LoginUserInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { BadRequestError, NotFoundError, UnauthorizedError, } from "../utils/errors.js";

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

  return user;
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

  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  return {
  user: {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  },
  accessToken,
  refreshToken,
  };

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

export const refreshAccessToken = (
  refreshToken: string
) => {
  const decoded =
    verifyRefreshToken(refreshToken);

  const accessToken =
    generateAccessToken(decoded.userId);

  return accessToken;
};

export const getCurrentUserService = async (
  userId: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};