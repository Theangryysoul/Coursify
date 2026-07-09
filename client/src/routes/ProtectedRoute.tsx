import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);

  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}