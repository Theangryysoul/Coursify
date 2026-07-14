import { Link } from "react-router-dom";
import { Flame, BookOpen, Clock3, Plus } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useLearningStats } from "@/hooks/progress/useLearningStats";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { Button } from "../ui/button";

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useLearningStats();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user?.avatar?.url ? (
            <AvatarImage src={
              user?.avatar?.url
                ? `${user.avatar.url}?t=${user.updatedAt}`
                : undefined
            } />
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

          <p className="mt-1 text-muted-foreground">
            Ready to continue your learning journey?
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>
                {stats?.totalCourses ?? 0} Courses
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>
                {stats?.streak ?? 0} Day Streak
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>
                {stats?.formattedWatchTime ??
                  "0h 0m"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="gap-2 rounded-2xl p-5"
      >
        <Link to="/import">
          <Plus className="h-5 w-5" />
          Import Course
        </Link>
      </Button>
    </div>
  );
}