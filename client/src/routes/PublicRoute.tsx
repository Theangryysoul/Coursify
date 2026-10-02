import { Navigate, Outlet } from "react-router-dom";

import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

/**
 * Keeps the login and register pages out of reach of an already signed-in
 * visitor, and stops them flickering while the session is being restored.
 */
export default function PublicRoute() {
  const status = useAuthStore(
    (state) => state.status
  );

  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "authenticated") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
