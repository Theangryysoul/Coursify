import mongoose from "mongoose";

import { env } from "./env.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connects to MongoDB once and reuses the connection afterwards.
 *
 * Vercel runs the API as a function, so the module can be evaluated on every
 * cold start. Caching the promise keeps a single connection per instance
 * instead of opening a new one per request.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10_000,
      })
      .then((instance) => {
        console.log("✅ MongoDB Connected");
        return instance;
      });
  }

  try {
    const instance = await connectionPromise;
    return instance.connection;
  } catch (error) {
    // Clear the failed promise so the next request retries the connection.
    connectionPromise = null;
    console.error("❌ Failed to connect to MongoDB", error);
    throw error;
  }
};
