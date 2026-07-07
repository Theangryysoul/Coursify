import { Request, Response } from "express";
import { env } from "../config/env.js";
import { successResponse } from "../utils/api-response.js";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service.js";

export const register = async (
  req: Request,
  res: Response
) => {
  const user = await registerUser(req.body);

  return successResponse(
    res,
    "User registered successfully",
    user,
  201
  );
};

export const login = async (
  req: Request,
  res: Response
) => {
  const data = await loginUser(req.body);

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(
    res,
    "Login successful",
    {
      user: data.user,
      accessToken: data.accessToken,
    }
  );
};

export const refresh = (
  req: Request,
  res: Response
) => {
  const refreshToken =
    req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Error("Unauthorized");
  }

  const accessToken =
    refreshAccessToken(refreshToken);

  return successResponse(
    res,
    "Access token refreshed",
    {
      accessToken,
    }
  );
};

export const logout = (
  req: Request,
  res: Response
) => {
  res.clearCookie("refreshToken");
  
  return successResponse(
    res,
    "Logged out successfully",
  );
};