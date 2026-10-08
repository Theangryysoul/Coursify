import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Logo } from "@/components/common/Logo";

import { SIDEBAR_ITEMS } from "./sidebar-items";
import { SidebarItem } from "./SidebarItem";

/**
 * The sidebar, as a slide-in drawer.
 *
 * The desktop sidebar is hidden below `lg`, which used to leave small screens
 * with no way to navigate at all. This is that missing navigation.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation"
          className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-xl transition"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-background w-[17rem] gap-0 p-0"
      >
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle asChild>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center"
            >
              <Logo className="h-9 w-auto" />
              <span className="sr-only">Coursify</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
