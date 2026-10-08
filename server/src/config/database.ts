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

// A `mongodb+srv://` URI is resolved by Node's own DNS client, and a resolver
// that is overloaded or rate limiting answers the SRV query with ECONNREFUSED
// instead of the record list. That is a moment in time rather than a
// misconfiguration, so the dial is attempted a few times before giving up.
const CONNECT_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = 300;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Whether the lookup itself failed rather than MongoDB refusing us - the only
 * kind worth retrying.
 *
 * These surface in milliseconds, so retrying them adds no noticeable latency.
 * A failure that consumed the whole server-selection timeout is a real outage,
 * and is reported on the first attempt instead of being repeated three times.
 */
const isNameResolutionFailure = (error: unknown) => {
  const code = (error as { code?: string } | null)?.code;

  if (
    code &&
    [
      "ECONNREFUSED",
      "ETIMEOUT",
      "ENOTFOUND",
      "ESERVFAIL",
      "EAI_AGAIN",
    ].includes(code)
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : "";

  return /querySrv|queryTxt|getaddrinfo/i.test(message);
};

const connect = async () => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const instance = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10_000,
        ...(databaseName ? {} : { dbName: DEFAULT_DATABASE_NAME }),
      });

      console.log("✅ MongoDB Connected");

      return instance;
    } catch (error) {
      if (attempt >= CONNECT_ATTEMPTS || !isNameResolutionFailure(error)) {
        throw error;
      }

      console.warn(
        `⚠️  MongoDB name lookup failed (attempt ${attempt}/${CONNECT_ATTEMPTS}), retrying`
      );

      await sleep(RETRY_BACKOFF_MS * attempt);
    }
  }
};

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

  // readyState 0 means the driver is fully disconnected - including the case
  // where a connection succeeded earlier and has since dropped. The cached
  // promise from that connection is spent, so it is discarded here. Without
  // this the stale resolved promise is handed back forever and every query
  // later dies on "Operation buffering timed out" instead of reconnecting.
  // A dial that is genuinely in flight reports state 2, so this cannot cancel
  // one.
  if (mongoose.connection.readyState === 0) {
    connectionPromise = null;
  }

  connectionPromise ??= connect();

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
