import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  title: string;
  icon: React.ElementType;
  /** Collapses the item to just its icon, with the title shown on hover. */
  collapsed?: boolean;
  /** Called after a link is followed, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarItem({
  href,
  title,
  icon: Icon,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      onClick={onNavigate}
      title={collapsed ? title : undefined}
      aria-label={collapsed ? title : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
            : "hover:text-foreground text-muted-foreground hover:bg-card"
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{title}</span>}
    </NavLink>
  );
}
