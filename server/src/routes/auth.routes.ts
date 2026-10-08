import { Router } from "express";
import { register, login, googleLogin, refresh, logout, changePasswordController, getCurrentUser } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, googleLoginSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
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

authRouter.post(
  "/google",
  validate(googleLoginSchema),
  googleLogin
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
