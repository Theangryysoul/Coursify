import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type {
  YoutubePreviewResponse,
  ImportedCourse,
} from "@/types/youtube";

export const previewYoutube = async (url: string) => {
  const response = await api.post<
    ApiResponse<YoutubePreviewResponse>
  >("/youtube/preview", {
    url,
  });

  return response.data.data;
};

export const importYoutube = async (url: string) => {
  const response = await api.post<
    ApiResponse<ImportedCourse>
  >("/youtube/import", {
    url,
  });

  return response.data.data;
};