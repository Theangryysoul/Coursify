import type { FolderColor } from "@/types/folder";

/**
 * Colour tokens are stored as names, so the mapping to real classes lives in
 * one place. The class strings are written out in full because Tailwind scans
 * for literal class names - building them from a template would leave them out
 * of the stylesheet.
 */
export const FOLDER_DOT_CLASSES: Record<FolderColor, string> = {
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
};

export const getFolderDotClass = (color: string | undefined) =>
  FOLDER_DOT_CLASSES[color as FolderColor] ?? FOLDER_DOT_CLASSES.violet;
