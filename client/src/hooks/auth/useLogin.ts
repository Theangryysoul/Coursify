import { useMutation } from "@tanstack/react-query";

import { login } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      loginStore(data.user, data.accessToken);
    },
  });
}