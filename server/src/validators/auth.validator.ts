import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50),

  email: z
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

/**
 * The credential is an ID token minted by Google Identity Services. It is
 * long, but a floor here rejects an obviously empty submission before it
 * reaches the verifier.
 */
export const googleLoginSchema = z.object({
  idToken: z.string().min(20, "Missing Google credential"),
});
