import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Nothing in this module may throw. On Vercel the API runs as a serverless
// function, so an exception during import fails every request with an opaque
// FUNCTION_INVOCATION_FAILED and no clue about the cause. Missing values are
// collected in `configErrors` instead, and the routes answer with a readable
// JSON error that names them (see app.ts).
const envSchema = z.object({
  PORT: z.string().default("5000"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .catch("development"),

  // Comma separated list of browser origins allowed to call the API, e.g.
  // "https://coursify.vercel.app,http://localhost:5173".
  // Requests from the same origin as the deployment are always allowed, so this
  // is only needed for extra origins and may stay empty.
  CLIENT_URL: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim().replace(/\/+$/, ""))
        .filter(Boolean)
    ),

  // Core configuration - the API cannot serve an authenticated request without
  // these.
  MONGODB_URI: z.string().default(""),

  JWT_ACCESS_SECRET: z.string().default(""),

  JWT_REFRESH_SECRET: z.string().default(""),

  // Feature configuration - only the avatar upload and YouTube import endpoints
  // use these, so a missing third-party key must never take authentication (or
  // the whole API) down with it.
  CLOUDINARY_CLOUD_NAME: z.string().default(""),

  CLOUDINARY_API_KEY: z.string().default(""),

  CLOUDINARY_API_SECRET: z.string().default(""),

  YOUTUBE_API_KEY: z.string().default(""),

  // The OAuth client id the browser uses with Google Identity Services. The
  // same value is the audience the ID token is verified against, so it must
  // match the client exactly or every Google sign-in is rejected.
  GOOGLE_CLIENT_ID: z.string().default(""),
});

const parsedEnv = envSchema.parse(process.env);

const REQUIRED_KEYS = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

const FEATURE_KEYS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "YOUTUBE_API_KEY",
  "GOOGLE_CLIENT_ID",
] as const;

/**
 * Names of the required variables that are not set. Empty when the deployment
 * is configured correctly. Routes refuse to run while this is non-empty.
 */
export const configErrors: string[] = REQUIRED_KEYS.filter(
  (key) => !parsedEnv[key]
);

const unsetFeatureKeys = FEATURE_KEYS.filter((key) => !parsedEnv[key]);

if (unsetFeatureKeys.length > 0) {
  console.warn(
    `⚠️  Missing feature environment variables: ${unsetFeatureKeys.join(
      ", "
    )}. Avatar upload, YouTube import and Google sign-in will not work.`
  );
}

export const env = {
  ...parsedEnv,
  PORT: Number(parsedEnv.PORT),
};

export const corsOrigins = parsedEnv.CLIENT_URL;
