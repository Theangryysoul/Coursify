import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { logout } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";

export function useLogout() {
  const clearSession = useAuthStore(
    (state) => state.clearSession
  );

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    // Runs even if the request fails, so the app never gets stuck holding a
    // session it can no longer use.
    onSettled: () => {
      clearSession();

      // Drop every cached response so the next account never sees the
      // previous one's courses or profile. Only the query cache is touched -
      // clearing the mutation cache here would remove this very mutation
      // while it is still settling.
      queryClient.cancelQueries();
      queryClient.removeQueries();

      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
