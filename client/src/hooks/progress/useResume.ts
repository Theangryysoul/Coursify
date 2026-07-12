import { useQuery } from "@tanstack/react-query";

import { getResume } from "@/api/progress.api";

export function useResume(
  videoId: string
) {
  return useQuery({
    queryKey: ["resume", videoId],
    queryFn: () => getResume(videoId),
    enabled: !!videoId,
  });
}