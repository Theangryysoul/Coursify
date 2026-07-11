import { useMutation } from "@tanstack/react-query";

import { refresh } from "@/api/auth.api";

export function useRefresh() {
  return useMutation({
    mutationFn: refresh,
  });
}