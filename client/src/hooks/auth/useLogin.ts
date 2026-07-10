import { useMutation } from "@tanstack/react-query";

import { login } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken
  );

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
}