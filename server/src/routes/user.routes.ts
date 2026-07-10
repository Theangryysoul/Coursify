import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getMe, updateMyProfile } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.middleware.js"
import { updateProfileSchema } from "../validators/user.validator.js";
import { upload } from "../config/multer.js";
import { uploadAvatarController } from "../controllers/upload.controller.js";

const userRouter = Router();

userRouter.get(
  "/me",
  authenticate,
  getMe
);

userRouter.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateMyProfile
);

userRouter.patch(
  "/avatar",
  authenticate,
  upload.single("image"),
  uploadAvatarController
);

export default userRouter;