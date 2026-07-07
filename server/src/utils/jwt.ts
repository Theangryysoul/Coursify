import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JwtPayload } from "../types/jwt.types.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants/auth.js"

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
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
      expiresIn: REFRESH_TOKEN_EXPIRY,
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