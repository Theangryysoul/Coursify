import { useMutation } from "@tanstack/react-query";

import { updateProfile } from "@/api/user.api";
import { useAuthStore } from "@/store/auth.store";

export const useUpdateProfile = () => {
  const setUser = useAuthStore(
    (state) => state.setUser
  );

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (user) => {
      setUser(user);
    },
  });
};