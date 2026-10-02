import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../utils/errors.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];

  // jwt.verify throws JsonWebTokenError / TokenExpiredError on bad or expired
  // tokens. Left uncaught it reaches the global error handler as a plain Error
  // and is reported as 500, so the client can never tell that it simply needs
  // to refresh its session.
  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }

  req.user = decoded;

  next();
};
