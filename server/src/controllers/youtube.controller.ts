import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";

export const previewYoutubeController = asyncHandler(
  async (req: Request, res: Response) => {
    return successResponse(
      res,
      "URL received successfully",
      req.body
    );
  }
);