import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  title: string;
  icon: React.ElementType;
}

export function SidebarItem({ href, title, icon: Icon }: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
          isActive
            ? "text-foreground bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg"
            : "hover:text-foreground text-muted-foreground hover:bg-card"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </NavLink>
  );
}
