import { useMutation } from "@tanstack/react-query";

import { loginWithGoogle } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

/**
 * Signs in with a Google ID token.
 *
 * Identical to the password login from the store's point of view: the server
 * answers with a profile and an access token, so the rest of the app cannot
 * tell the two apart.
 */
export function useGoogleLogin() {
  const setSession = useAuthStore(
    (state) => state.setSession
  );

  return useMutation({
    mutationFn: loginWithGoogle,

    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
    },
  });
}
