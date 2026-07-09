import { Request, Response } from "express";
import { deleteImage ,uploadAvatar } from "../services/upload.service.js";
import { getCurrentUser, updateAvatar } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import { BadRequestError } from "../utils/errors.js";

export const uploadAvatarController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Image is required");
    }

    const currentUser = await getCurrentUser(req.user.userId);

    if (currentUser.avatar?.publicId) {
        await deleteImage(currentUser.avatar.publicId);
    }

    const avatar = await uploadAvatar(req.file.buffer);

    const updatedUser = await updateAvatar(
      req.user.userId,
      avatar
    );

    return successResponse(
      res,
      "Avatar updated successfully",
      updatedUser 
    );
  }
);