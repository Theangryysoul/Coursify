import { Request, Response } from "express";
import { successResponse } from "../utils/api-response.js";

export const healthCheck = (_: Request, res: Response) => {
  return successResponse(
    res,
    "Backend is healthy",
    {
      status: "ok",
      version: "1.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }
  );
};