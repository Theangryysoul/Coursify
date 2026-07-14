import { useMutation } from "@tanstack/react-query";

import { uploadAvatar } from "@/api/user.api";
import { useAuthStore } from "@/store/auth.store";

export const useUploadAvatar = () => {
  const setUser = useAuthStore(
    (state) => state.setUser
  );

  return useMutation({
    mutationFn: uploadAvatar,

    onSuccess: (user) => {
      setUser(user);
    },
  });
};