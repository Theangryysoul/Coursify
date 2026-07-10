import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  console.log(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative outline-none">
          <Avatar>
            {user?.avatar?.url ? (
              <AvatarImage
                src={user.avatar.url}
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

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem>Settings</DropdownMenuItem>

        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}