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

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),

  CLOUDINARY_API_KEY: z.string().min(1),

  CLOUDINARY_API_SECRET: z.string().min(1),

  YOUTUBE_API_KEY: z.string().min(1),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  PORT: Number(parsedEnv.PORT),
};

export const corsOrigins = parsedEnv.CLIENT_URL;
