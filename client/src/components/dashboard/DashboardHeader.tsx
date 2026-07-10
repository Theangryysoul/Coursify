import { useAuthStore } from "@/store/auth.store";
import {Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14">
        {user?.avatar?.url ? (
          <AvatarImage
            src={user.avatar.url}
          />
        ) : (
          <AvatarFallback>
            {user?.name?.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      <div>
        <h1 className="text-4xl font-bold">
          {greeting},{" "}
          {user?.name ?? "Learner"} 👋
        </h1>

        <p className="text-muted-foreground">
          Ready to continue your learning journey?
        </p>
      </div>
    </div>
  );
}