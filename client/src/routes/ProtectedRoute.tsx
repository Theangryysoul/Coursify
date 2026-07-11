import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedRoute() {
  const token = useAuthStore(
    (state) => state.accessToken
  );

  if (token === null) {
    return null;
  }

  return token
    ? <Outlet />
    : <Navigate to={ROUTES.LOGIN} replace />;
}