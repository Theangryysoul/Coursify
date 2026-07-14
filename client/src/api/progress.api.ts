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

export interface LearningStatsResponse {
  totalCourses: number;
  completedVideos: number;
  totalWatchTime: number;
  formattedWatchTime: string;
  streak: number;
}

export interface HeatmapDay {
  date: string;
  watchedSeconds: number;
  level: number;
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

export const getLearningStats = async () => {
  const response =
    await api.get<ApiResponse<LearningStatsResponse>>(
      "/progress/stats"
    );

  return response.data.data;
};

export const getHeatmap = async () => {
  const response =
    await api.get<
      ApiResponse<HeatmapDay[]>
    >("/progress/heatmap");

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

export const toggleCompleted = async (
  videoId: string
) => {
  const response = await api.patch(
    `/progress/${videoId}/toggle`
  );

  return response.data.data;
};