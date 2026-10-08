import { z } from "zod";

/**
 * The palette the client knows how to render. Restricting the value here means
 * the UI never receives a colour token it cannot map to a class.
 */
export const FOLDER_COLORS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "cyan",
] as const;

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(60, "Folder name is too long"),

  color: z.enum(FOLDER_COLORS).optional(),
});

export const updateFolderSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Folder name is required")
      .max(60, "Folder name is too long")
      .optional(),

    color: z.enum(FOLDER_COLORS).optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.color !== undefined,
    { message: "Nothing to update" }
  );

/**
 * `folderId: null` files the course under "Uncategorised", which is why null
 * is allowed rather than treated as a missing field.
 */
export const assignFolderSchema = z.object({
  folderId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null)),
});
