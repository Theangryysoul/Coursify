import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type { CourseItem } from "@/types/course";

export const getCourses = async () => {
  const response = await api.get<ApiResponse<CourseItem[]>>(
    "/courses"
  );

  return response.data.data;
};

/**
 * Removes the course from the signed-in user's library. The shared course
 * document is only collected server-side once nobody else references it.
 */
export const deleteCourse = async (courseId: string) => {
  await api.delete(`/courses/${courseId}`);
};

/**
 * Files a course into a folder. Passing `null` moves it back to
 * "Uncategorised".
 */
export const setCourseFolder = async (
  courseId: string,
  folderId: string | null
) => {
  const response = await api.patch<ApiResponse<CourseItem>>(
    `/courses/${courseId}/folder`,
    { folderId }
  );

  return response.data.data;
};
