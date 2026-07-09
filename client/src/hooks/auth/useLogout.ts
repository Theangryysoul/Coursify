import { useMutation } from "@tanstack/react-query";

import { logout } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      logoutStore();
    },
  });
}