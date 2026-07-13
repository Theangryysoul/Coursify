import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProgress } from "@/api/progress.api";

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      videoId,
      data,
    }: {
      videoId: string;
      data: Parameters<
        typeof updateProgress
      >[1];
    }) =>
      updateProgress(
        videoId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["learning-stats"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course-details"],
      });
    },
  });
}