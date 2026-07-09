import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth.api";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: getCurrentUser,
    retry: false,
  });
}