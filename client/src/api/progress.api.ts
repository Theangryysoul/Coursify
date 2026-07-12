import { api } from "./axios";

import type { ApiResponse } from "@/types/api";

export interface ResumeResponse {
  currentTime: number;
  completed: boolean;
  watchedSegments: {
    start: number;
    end: number;
  }[];
}

export interface UpdateProgressRequest {
  currentTime: number;
  duration: number;
  segment: {
    start: number;
    end: number;
  };
}

export const getResume = async (
  videoId: string
) => {
  const response =
    await api.get<ApiResponse<ResumeResponse>>(
      `/progress/${videoId}`
    );

  return response.data.data;
};

export const updateProgress = async (
  videoId: string,
  data: UpdateProgressRequest
) => {
  const response =
    await api.patch(
      `/progress/${videoId}`,
      data
    );

  return response.data.data;
};