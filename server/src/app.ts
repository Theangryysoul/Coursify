import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import router from "./routes/index.js";
import { notFound } from "./middleware/not-found.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", router);
app.use(notFound);
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.send("Coursify Backend is running 🚀");
});

export default app;