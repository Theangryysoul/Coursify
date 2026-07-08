import { z } from "zod";

export const updateProgressSchema = z.object({
  currentTime: z.number().min(0),

  duration: z.number().positive(),

  segment: z
    .object({
      start: z.number().min(0),
      end: z.number().min(0),
    })
    .refine(
      (segment) => segment.end > segment.start,
      {
        message: "Segment end must be greater than start",
        path: ["end"],
      }
    ),
});