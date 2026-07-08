import { z } from "zod";

export const youtubeUrlSchema = z.object({
  url: z.string().url("Invalid URL"),
});

export type YoutubeUrlInput = z.infer<typeof youtubeUrlSchema>;