import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import { NotFoundError } from "../utils/errors.js";
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "../services/folder.service.js";

/**
 * An id that is not a valid ObjectId makes Mongoose throw a CastError, which
 * the global handler would report as a 500. Rejecting it here keeps a bad URL
 * a 404, which is what it actually is.
 */
const requireValidId = (value: unknown) => {
  if (typeof value !== "string" || !isValidObjectId(value)) {
    throw new NotFoundError("Folder not found");
  }

  return value;
};

export const getFoldersController = asyncHandler(
  async (req: Request, res: Response) => {
    const folders = await getFolders(req.user.userId);

    return successResponse(
      res,
      "Folders fetched successfully",
      folders
    );
  }
);

export const createFolderController = asyncHandler(
  async (req: Request, res: Response) => {
    const folder = await createFolder(req.user.userId, req.body);

    return successResponse(
      res,
      "Folder created successfully",
      folder,
      201
    );
  }
);

export const updateFolderController = asyncHandler(
  async (req: Request, res: Response) => {
    const folderId = requireValidId(req.params.id);

    const folder = await updateFolder(
      req.user.userId,
      folderId,
      req.body
    );

    return successResponse(
      res,
      "Folder updated successfully",
      folder
    );
  }
);

export const deleteFolderController = asyncHandler(
  async (req: Request, res: Response) => {
    const folderId = requireValidId(req.params.id);

    await deleteFolder(req.user.userId, folderId);

    return successResponse(res, "Folder deleted successfully");
  }
);
