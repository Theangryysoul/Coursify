export const FOLDER_COLORS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "cyan",
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

export interface Folder {
  _id: string;
  name: string;
  color: FolderColor;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}
