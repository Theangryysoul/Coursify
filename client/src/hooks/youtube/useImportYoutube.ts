import { useMutation } from "@tanstack/react-query";

import { importYoutube } from "@/api/youtube.api";

export function useImportYoutube() {
  return useMutation({
    mutationFn: importYoutube,
  });
}