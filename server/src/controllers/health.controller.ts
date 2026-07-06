import { Request, Response } from "express";
import { successResponse } from "../utils/api-response.js";

export const healthCheck = (_: Request, res: Response) => {
  return successResponse(res, "Coursify API is healthy 🚀");
};