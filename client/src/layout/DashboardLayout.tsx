import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";

import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";

export function DashboardLayout() {

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const { data } = useCurrentUser(!!accessToken);
  console.log("Current User:", data);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <Navbar />

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}