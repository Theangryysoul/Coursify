import { Request, Response } from "express";
import { env } from "../config/env.js";
import { successResponse } from "../utils/api-response.js";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service.js";
import { UnauthorizedError } from "../utils/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(
  async (req, res) => {
  const user = await registerUser(req.body);

    return successResponse(
      res,
      "User registered successfully",
      user,
    201
    )
  }
);

export const login = asyncHandler(
  async (req, res) => {
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
    })
  }
);

export const refresh = asyncHandler(
  async (req, res) => {
  const refreshToken =
    req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const accessToken =
    refreshAccessToken(refreshToken);

  return successResponse(
    res,
    "Access token refreshed",
    {
      accessToken,
    })
  }
);

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