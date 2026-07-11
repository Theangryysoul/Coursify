import { useQuery } from "@tanstack/react-query";

import { getCourses } from "@/api/course.api";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}