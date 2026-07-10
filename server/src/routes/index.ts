import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import youtubeRouter from "./youtube.routes.js";
import courseRouter from "./course.routes.js";
import progressRouter from "./progress.routes.js";

const router = Router();

router.get("/health", healthCheck);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/youtube", youtubeRouter);
router.use("/courses", courseRouter);
router.use("/progress", progressRouter);


export default router;