import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";

import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Bell } from "lucide-react";
import { UserMenu } from "@/components/dashboard/UserMenu";

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
  const location = useLocation();

  const isDashboard = location.pathname === ROUTES.DASHBOARD;
  const isSettings = location.pathname === ROUTES.SETTINGS;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

        <main className="flex flex-1 flex-col">

          {isDashboard ? (
            <Navbar />
          ) : !isSettings ? (
            <div
              className="
                flex
                h-16
                items-center
                justify-end
                gap-3
                border-b
                border-border/60
                bg-background/70
                px-8
                backdrop-blur-2xl
              "
            >
              <ThemeToggle />

              <button className="rounded-full p-2 hover:bg-accent">
                <Bell className="h-5 w-5" />
              </button>

              <UserMenu />
            </div>
          ) : null}

          <div className="flex-1 p-6">
            <Outlet />
          </div>

        </main>
    </div>
  );
}