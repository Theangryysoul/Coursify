import { useAuthStore } from "@/store/auth.store";

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
    <div className="space-y-2">
      <h1 className="text-4xl font-bold">
        {greeting},
        {" "}
        {user?.name ?? "Learner"} 👋
      </h1>

      <p className="text-muted-foreground">
        Ready to continue your learning journey?
      </p>
    </div>
  );
}