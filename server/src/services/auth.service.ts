import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { RegisterUserInput, LoginUserInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { BadRequestError, UnauthorizedError, } from "../utils/errors.js";

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
    id: user._id,
    name: user.name,
    email: user.email,
  },
  accessToken,
  refreshToken,
  };

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
    id: user._id,
    name: user.name,
    email: user.email,
  };
};