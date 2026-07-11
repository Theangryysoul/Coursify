import { useMutation } from "@tanstack/react-query";

import { previewYoutube } from "@/api/youtube.api";

export function useYoutubePreview() {
  return useMutation({
    mutationFn: previewYoutube,
  });
}