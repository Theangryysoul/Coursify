import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import {
  getResume,
  updateProgress,
  getLearningStats,
  toggleCompleted,
  getHeatmapData,
} from "../services/progress.service.js";

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

export const toggleCompletedController = asyncHandler(
  async (req: Request, res: Response) => {
    const progress = await toggleCompleted(
      req.user.userId,
      req.params.videoId as string
    );

    return successResponse(
      res,
      "Video completion updated successfully",
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

export const getHeatmapController = asyncHandler(
  async (req: Request, res: Response) => {
    const heatmap = await getHeatmapData(
      req.user.userId
    );

    return successResponse(
      res,
      "Heatmap fetched successfully",
      heatmap
    );
  }
);