import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl flex-1">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder="Search courses..."
        className="
          h-11
          rounded-2xl
          border-border/60
          bg-card/60
          pl-11
          pr-16
          backdrop-blur-xl
        "
      />

      <kbd
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          rounded-md
          border
          border-border
          bg-background/80
          px-2
          py-0.5
          text-[11px]
          text-muted-foreground
        "
      >
        Ctrl K
      </kbd>
    </div>
  );
}