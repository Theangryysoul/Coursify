import { z } from "zod";

/**
 * These rules must stay in step with `server/src/validators/auth.validator.ts`.
 * When the client is looser than the server, the form accepts input the API
 * then rejects - and the user only finds out after submitting.
 */

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
