import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function DashboardLayout() {
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