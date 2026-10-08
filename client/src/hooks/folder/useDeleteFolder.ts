import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteFolder } from "@/api/folder.api";

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,

    // The server moves the folder's courses back to "Uncategorised" rather
    // than deleting them, so the course list has to be refreshed too - without
    // this the cards would still claim a folder that no longer exists.
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
}
