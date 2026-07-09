import { Bell } from "lucide-react";

import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  return (
    <>
      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          items-center
          gap-8
          border-b
          border-border/60
          bg-background/70
          px-8
          backdrop-blur-2xl
        "
      >
        <div className="flex flex-1">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-3 pr-2">
          <ThemeToggle />

          <button className="rounded-full p-2 transition hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>

          <UserMenu />
        </div>
      </header>

    </>
  );
}
