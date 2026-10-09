import { useQuery } from "@tanstack/react-query";

import { getAuthConfig } from "@/api/auth.api";
import { env } from "@/config/env";

/**
 * The OAuth client id Google Identity Services should be initialised with.
 *
 * `VITE_GOOGLE_CLIENT_ID` is baked into the bundle at build time, which makes
 * it a second place the deployment has to be configured: a build that is
 * missing it produced no button at all, even though the server was perfectly
 * able to verify tokens. The server therefore also publishes the id it verifies
 * against - the one copy that cannot be absent while sign-in works - and it is
 * used whenever the build did not supply one.
 *
 * The query is skipped entirely when the build value is present, so a correctly
 * configured deployment makes no extra request.
 */
export function useGoogleClientId() {
  const buildTimeClientId = env.GOOGLE_CLIENT_ID;

  const { data } = useQuery({
    queryKey: ["auth", "config"],
    queryFn: getAuthConfig,

    enabled: !buildTimeClientId,

    // It is a constant for the life of the deployment, and the button is on the
    // two pages a signed-out visitor sees first.
    staleTime: Infinity,

    retry: 1,
  });

  return buildTimeClientId || data?.googleClientId || "";
}
