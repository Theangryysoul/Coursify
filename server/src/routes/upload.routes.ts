import { Router } from "express";
import { upload } from "../config/multer.js";
import { uploadAvatarController } from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const uploadRouter = Router();

uploadRouter.post(
  "/avatar",
  authenticate,
  upload.single("image"),
  uploadAvatarController
);

export default uploadRouter;