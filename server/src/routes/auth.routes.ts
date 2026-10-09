import { Router } from "express";
import { register, login, googleLogin, refresh, logout, changePasswordController, getCurrentUser, getAuthConfig } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, googleLoginSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { changePasswordSchema } from "../validators/changePassword.validator.js";

const authRouter = Router();

// Public: the sign-in screens need this before there is a session, and it holds
// nothing that is not already in the browser bundle.
authRouter.get("/config", getAuthConfig);

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
