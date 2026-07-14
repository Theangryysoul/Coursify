import { useMutation } from "@tanstack/react-query";

import { deleteAvatar } from "@/api/user.api";
import { useAuthStore } from "@/store/auth.store";

export const useDeleteAvatar = () => {
  const setUser = useAuthStore(
    (state) => state.setUser
  );

  return useMutation({
    mutationFn: deleteAvatar,

    onSuccess: (user) => {
      setUser(user);
    },
  });
};