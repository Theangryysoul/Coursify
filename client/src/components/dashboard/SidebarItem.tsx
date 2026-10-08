import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  title: string;
  icon: React.ElementType;
  /** Called after a link is followed, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarItem({
  href,
  title,
  icon: Icon,
  onNavigate,
}: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
          isActive
            ? "text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg"
            : "hover:text-foreground text-muted-foreground hover:bg-card"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </NavLink>
  );
}
