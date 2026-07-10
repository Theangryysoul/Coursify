import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth.api";
import type { User } from "@/types/user";

export function useCurrentUser(enabled: boolean) {
  return useQuery<User, Error>({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled,
  });
}