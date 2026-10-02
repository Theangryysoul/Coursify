import mongoose from "mongoose";

import { env } from "./env.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

// The application database. A connection string without a database name (a
// bare ".../mongodb.net/") is valid, and Mongoose then silently uses its
// default "test" database. Falling back here keeps auth data in the same
// database in every environment.
const DEFAULT_DATABASE_NAME = "coursify";

const getDatabaseName = (uri: string): string | undefined => {
  try {
    return new URL(uri).pathname.replace(/^\/+/, "") || undefined;
  } catch {
    return undefined;
  }
};

const databaseName = getDatabaseName(env.MONGODB_URI);

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
        ...(databaseName ? {} : { dbName: DEFAULT_DATABASE_NAME }),
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
