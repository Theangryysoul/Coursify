import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type { Folder, FolderColor } from "@/types/folder";

export const getFolders = async () => {
  const response = await api.get<ApiResponse<Folder[]>>(
    "/folders"
  );

  return response.data.data;
};

export const createFolder = async (data: {
  name: string;
  color?: FolderColor;
}) => {
  const response = await api.post<ApiResponse<Folder>>(
    "/folders",
    data
  );

  return response.data.data;
};

export const updateFolder = async (
  folderId: string,
  data: { name?: string; color?: FolderColor }
) => {
  const response = await api.patch<ApiResponse<Folder>>(
    `/folders/${folderId}`,
    data
  );

  return response.data.data;
};

export const deleteFolder = async (folderId: string) => {
  await api.delete(`/folders/${folderId}`);
};
