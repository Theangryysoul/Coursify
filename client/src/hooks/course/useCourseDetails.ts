import { useQuery } from "@tanstack/react-query";

import { getCourseDetails } from "@/api/course-details.api";

export function useCourseDetails(courseId: string) {
  return useQuery({
    queryKey: ["course-details", courseId],
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId,
    staleTime: 0,
  });
}