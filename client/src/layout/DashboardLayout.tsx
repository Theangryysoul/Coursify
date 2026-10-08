import { Outlet, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

import { MobileNav } from "@/components/dashboard/MobileNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { PageTransition } from "@/components/common/PageTransition";
import { Logo } from "@/components/common/Logo";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { ROUTES } from "@/constants/routes";

/**
 * The header shown on every page except Settings.
 *
 * On small screens the sidebar is not rendered, so the hamburger beside the
 * logo is the only navigation - which is why it appears here rather than being
 * buried in a page.
 */
function TopBar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        h-16
        shrink-0
        items-center
        gap-3
        border-b
        border-border/60
        bg-background/70
        px-4
        backdrop-blur-2xl
        sm:px-6
        lg:justify-end
        lg:px-8
      "
    >
      {/* Only present while the sidebar is hidden. */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNav />

        <Logo className="h-8 w-auto" />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Notifications"
          className="hover:bg-accent rounded-full p-2 transition"
        >
          <Bell className="h-5 w-5" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}

export function DashboardLayout() {
  const location = useLocation();

  const isSettings = location.pathname === ROUTES.SETTINGS;

  return (
    // `overflow-x-clip` (not `hidden`) contains any accidental overflow
    // without creating a scroll container - `hidden` would make this element
    // the scroll parent and silently break the sticky header below it.
    <div className="bg-background flex min-h-screen w-full overflow-x-clip">
      <Sidebar />

      {/* min-w-0 stops a wide child (a long course title, a table) from
          stretching the flex row and pushing the page into horizontal
          scroll. */}
      <main className="flex min-w-0 flex-1 flex-col">
        {isSettings ? (
          // Settings keeps its chrome-free look on desktop, but mobile still
          // needs a way out of the page.
          <div className="flex h-16 shrink-0 items-center gap-3 px-4 lg:hidden">
            <MobileNav />

            <Logo className="h-8 w-auto" />
          </div>
        ) : (
          <TopBar />
        )}

        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
