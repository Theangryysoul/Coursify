import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toggleCompleted } from "@/api/progress.api";

export function useToggleCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCompleted,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-details"],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["learning-stats"],
      });
    },
  });
}