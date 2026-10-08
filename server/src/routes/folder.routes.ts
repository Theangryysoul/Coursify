import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createFolderSchema,
  updateFolderSchema,
} from "../validators/folder.validator.js";
import {
  createFolderController,
  deleteFolderController,
  getFoldersController,
  updateFolderController,
} from "../controllers/folder.controller.js";

const router = Router();

router.get("/", authenticate, getFoldersController);

router.post(
  "/",
  authenticate,
  validate(createFolderSchema),
  createFolderController
);

router.patch(
  "/:id",
  authenticate,
  validate(updateFolderSchema),
  updateFolderController
);

router.delete("/:id", authenticate, deleteFolderController);

export default router;
