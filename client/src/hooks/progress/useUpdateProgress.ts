import { useMutation } from "@tanstack/react-query";

import { updateProgress } from "@/api/progress.api";

export function useUpdateProgress() {
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
  });
}