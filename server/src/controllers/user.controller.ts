import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import { getCurrentUser, updateProfile } from "../services/user.service.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.userId);

  return successResponse(
    res,
    "User fetched successfully",
    user
  );
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(
    req.user.userId,
    req.body
  );

  return successResponse(
    res,
    "Profile updated successfully",
    user
  );
});