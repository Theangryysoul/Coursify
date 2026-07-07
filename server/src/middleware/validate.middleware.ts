import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../utils/errors.js";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new BadRequestError(
        result.error.issues[0].message
      );
    }

    req.body = result.data;

    next();
  };