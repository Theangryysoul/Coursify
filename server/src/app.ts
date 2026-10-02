import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { connectDB } from "./config/database.js";
import { corsOrigins } from "./config/env.js";
import router from "./routes/index.js";
import { notFound } from "./middleware/not-found.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

// The API always runs behind a proxy (Vercel), so the client IP and host are
// read from the X-Forwarded-* headers.
app.set("trust proxy", 1);

app.use(
  cors((req, callback) => {
    const origin = req.header("Origin");

    // Requests without an Origin header (health checks, curl, server to
    // server) are always allowed.
    if (!origin) {
      return callback(null, { origin: true, credentials: true });
    }

    let isSameOrigin = false;

    try {
      isSameOrigin = new URL(origin).host === req.header("Host");
    } catch {
      isSameOrigin = false;
    }

    return callback(null, {
      origin: isSameOrigin || corsOrigins.includes(origin),
      credentials: true,
    });
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// A function instance can serve its first request without a database
// connection, so make sure one exists before any API route runs.
app.use("/api/v1", async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.send("Coursify Backend is running 🚀");
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
