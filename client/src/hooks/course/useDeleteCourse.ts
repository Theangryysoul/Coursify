import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteCourse } from "@/api/course.api";

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    // The card needs the id to know which row to remove optimistically, so the
    // id travels with the variables rather than being read back off the
    // response.
    mutationFn: (courseId: string) => deleteCourse(courseId),

    onSuccess: (_data, courseId) => {
      // Drop the deleted course's cached detail page so navigating back to it
      // does not render a course the user no longer owns.
      queryClient.removeQueries({
        queryKey: ["course-details", courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["learning-stats"],
      });
    },
  });
}
