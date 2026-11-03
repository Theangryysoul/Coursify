import { useState } from "react";
import { Link } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import { SIDEBAR_ITEMS } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";

import { Logo } from "@/components/common/Logo";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  );

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "bg-background/20 border-border hidden h-screen shrink-0 border-r backdrop-blur-xl transition-[width] duration-200 ease-linear lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo and collapse toggle */}

      <div
        className={cn(
          "border-border flex items-center border-b",
          collapsed ? "justify-center p-4" : "justify-between gap-2 p-6"
        )}
      >
        {!collapsed && (
          <Link to="/dashboard">
            <Logo className="h-10 w-auto transition-opacity hover:opacity-80" />
          </Link>
        )}

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}

      <nav className={cn("flex-1 space-y-2", collapsed ? "p-3" : "p-4")}>
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}
