import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default userRouter;