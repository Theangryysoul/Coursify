import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(3).max(50).optional(),

  bio: z.string().trim().max(300).optional(),
});