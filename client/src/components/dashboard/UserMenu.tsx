import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);

  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="relative rounded-full outline-none">
      <Avatar className="h-10 w-10">
        {user?.avatar?.url ? (
          <AvatarImage
            src={
              user?.avatar?.url
                ? `${user.avatar.url}?t=${user.updatedAt}`
                : undefined
            }
            alt={user.name}
          />
        ) : (
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        )}
      </Avatar>

      <span
        className="
          absolute
          bottom-0
          right-0
          h-3
          w-3
          rounded-full
          border-2
          border-background
          bg-emerald-500
        "
      />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={10}
    className="w-96 rounded-2xl p-3 rounded-xl px-3 py-3 text-base"
  >
  <DropdownMenuLabel className="py-3">
    <div className="flex flex-col gap-1">
      <span className="text-base font-semibold">
        {user?.name}
      </span>

      <span className="text-sm text-muted-foreground">
        {user?.email}
      </span>
    </div>
  </DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-base"
        >
          <User className="h-4 w-4" />
          My Profile
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link
          to="/progress"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-base"
        >
          <BarChart3 className="h-4 w-4" />
          Progress
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-base"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>

    <DropdownMenuSeparator />

    <DropdownMenuItem className="text-red-500 focus:text-red-500">
      <LogOut className="mr-3 rounded-xl px-3 py-3 text-base h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
    </DropdownMenu>
  );
}