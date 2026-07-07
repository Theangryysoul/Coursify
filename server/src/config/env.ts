import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLIENT_URL: z.string().url(),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),

  CLOUDINARY_API_KEY: z.string().min(1),

  CLOUDINARY_API_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);