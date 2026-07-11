import { api } from "./axios";

import type { ApiResponse } from "@/types/api";
import type { CourseItem } from "@/types/course";

export const getCourses = async () => {
  const response = await api.get<ApiResponse<CourseItem[]>>(
    "/courses"
  );

  return response.data.data;
};