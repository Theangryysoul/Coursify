import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { setCourseFolder } from "@/api/course.api";

type SetCourseFolderVariables = {
  courseId: string;
  folderId: string | null;
};

export function useSetCourseFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, folderId }: SetCourseFolderVariables) =>
      setCourseFolder(courseId, folderId),

    onSuccess: () => {
      // Both the course cards and the folder counts change when a course is
      // filed somewhere else.
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },
  });
}
