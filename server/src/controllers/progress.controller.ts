import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import { getResume } from "../services/progress.service.js";
import { updateProgress } from "../services/progress.service.js";
import { getLearningStats } from "../services/progress.service.js";

export const getResumeController = asyncHandler(
  async (req: Request, res: Response) => {
    const progress = await getResume(
      req.user.userId,
      req.params.videoId as string
    );

    return successResponse(
      res,
      "Resume fetched successfully",
      progress
    );
  }
);

export const updateProgressController = asyncHandler(
  async (req: Request, res: Response) => {
    const progress = await updateProgress(
      req.user.userId,
      req.params.videoId as string,
      req.body
    );

    return successResponse(
      res,
      "Progress updated successfully",
      progress
    );
  }
);

export const getLearningStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getLearningStats(
      req.user.userId
    );
    
    return successResponse(
      res,
      "Learning statistics fetched successfully",
      stats
    );
  }
);