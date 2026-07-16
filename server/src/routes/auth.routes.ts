import { Router } from "express";
import { register, login, refresh, logout, changePasswordController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../services/user.service.js";
import { changePasswordSchema } from "../validators/changePassword.validator.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  register
);

authRouter.post(
  "/login",
  validate(loginSchema),
  login
);

authRouter.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePasswordController
);

authRouter.post("/refresh", refresh);

authRouter.get("/me", authenticate, getCurrentUser);

authRouter.post("/logout", logout);

export default authRouter;