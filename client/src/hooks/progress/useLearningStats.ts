import { useQuery } from "@tanstack/react-query";

import { getLearningStats } from "@/api/progress.api";

export const useLearningStats = () => {
  return useQuery({
    queryKey: ["learning-stats"],
    queryFn: getLearningStats,
  });
};