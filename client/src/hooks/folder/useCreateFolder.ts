import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createFolder } from "@/api/folder.api";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },
  });
}
