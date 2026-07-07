import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JwtPayload } from "../types/jwt.types.js";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as JwtPayload;
};