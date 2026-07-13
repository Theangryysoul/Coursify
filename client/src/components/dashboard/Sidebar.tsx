import { Link } from "react-router-dom";

import { SIDEBAR_ITEMS } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";

import { Logo } from "@/components/common/Logo";

export function Sidebar() {
  return (
    <aside className="bg-background/20 border-border hidden h-screen w-72 shrink-0 border-r backdrop-blur-xl lg:flex lg:flex-col">
      {/* Logo */}

      <div className="border-border border-b p-6">
        <Link to="/dashboard">
          <Logo className="h-10 w-auto transition-opacity hover:opacity-80" />
        </Link>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}