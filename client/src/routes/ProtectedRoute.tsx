import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedRoute() {
  const status = useAuthStore(
    (state) => state.status
  );

  const location = useLocation();

  // The refresh cookie has not been checked yet - anything else here would
  // bounce a signed-in user to /login on every page reload.
  if (status === "loading") {
    return <FullPageLoader />;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
