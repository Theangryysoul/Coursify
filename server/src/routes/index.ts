import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import uploadRouter from "./upload.routes.js";

const router = Router();

router.get("/health", healthCheck);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/upload", uploadRouter);

export default router;