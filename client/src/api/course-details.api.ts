import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type { CourseDetails } from "@/types/course-details";

export const getCourseDetails = async (
  courseId: string
) => {
  const response = await api.get<ApiResponse<CourseDetails>>(
    `/courses/${courseId}`
  );

  return response.data.data;
};