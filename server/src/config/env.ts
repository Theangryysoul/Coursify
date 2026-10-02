import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

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

  // Core configuration. The API cannot serve an authenticated request without
  // these, so a missing value is a hard failure.
  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),

  // Feature configuration. Only the avatar upload and YouTube import endpoints
  // use these, so they default to empty: a missing third-party key must never
  // take authentication - or the whole API - down with it.
  CLOUDINARY_CLOUD_NAME: z.string().default(""),

  CLOUDINARY_API_KEY: z.string().default(""),

  CLOUDINARY_API_SECRET: z.string().default(""),

  YOUTUBE_API_KEY: z.string().default(""),
});

const parsed = envSchema.safeParse(process.env);

// A raw ZodError here is a stack trace with no context, and on Vercel it is the
// only clue for why every route is failing. Name the offending variables.
if (!parsed.success) {
  const invalid = parsed.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");

  throw new Error(
    `Invalid environment configuration. Check these variables: ${invalid}`
  );
}

const parsedEnv = parsed.data;

const unsetFeatureKeys = (
  [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "YOUTUBE_API_KEY",
  ] as const
).filter((key) => !parsedEnv[key]);

if (unsetFeatureKeys.length > 0) {
  console.warn(
    `⚠️  Missing feature environment variables: ${unsetFeatureKeys.join(
      ", "
    )}. Avatar upload and YouTube import will not work.`
  );
}

export const env = {
  ...parsedEnv,
  PORT: Number(parsedEnv.PORT),
};

export const corsOrigins = parsedEnv.CLIENT_URL;
