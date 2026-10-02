import { useMutation } from "@tanstack/react-query";

import { register } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useRegister() {
  const setSession = useAuthStore(
    (state) => state.setSession
  );

  return useMutation({
    mutationFn: register,

    // Registration signs the user in straight away - the server sets the
    // refresh cookie and returns a token, so making them log in again would
    // only be busywork.
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
    },
  });
}
