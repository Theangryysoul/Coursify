import { useQuery } from "@tanstack/react-query";

import { getHeatmap } from "@/api/progress.api";

export const useHeatmap = () => {
  return useQuery({
    queryKey: ["heatmap"],
    queryFn: getHeatmap,
  });
};