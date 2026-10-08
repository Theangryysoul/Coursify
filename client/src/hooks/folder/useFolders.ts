import { useQuery } from "@tanstack/react-query";

import { getFolders } from "@/api/folder.api";

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
    staleTime: 0,
  });
}
