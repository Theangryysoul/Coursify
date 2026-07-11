import { useEffect } from "react";

import { useRefresh } from "@/hooks/auth/useRefresh";
import { useAuthStore } from "@/store/auth.store";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken
  );

  const refreshMutation = useRefresh();

  useEffect(() => {
    if (accessToken) return;

    refreshMutation.mutate(undefined, {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
      },
    });
  }, []);

  return <>{children}</>;
}