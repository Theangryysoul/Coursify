import { Request, Response } from "express";
import { successResponse } from "../utils/api-response.js";
import { registerUser } from "../services/auth.service.js";

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