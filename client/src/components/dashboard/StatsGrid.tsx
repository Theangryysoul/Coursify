import {
  BookOpen,
  Clock3,
  PlayCircle,
  Flame,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { useLearningStats } from "@/hooks/progress/useLearningStats";
import { Link } from "react-router-dom";

export function StatsGrid() {
  const { data, isPending } = useLearningStats();

  if (isPending) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-3xl bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Link to="/courses">
      <StatCard
        title="Courses"
        value={String(data?.totalCourses ?? 0)}
        icon={BookOpen}
      /></Link>

      <StatCard
        title="Videos Completed"
        value={String(data?.completedVideos ?? 0)}
        icon={PlayCircle}
      />

      <StatCard
        title="Watch Time"
        value={data?.formattedWatchTime ?? "0h 0m"}
        icon={Clock3}
      />

      <StatCard
        title="Streak"
        value={`${data?.streak ?? 0} 🔥`}
        icon={Flame}
      />
    </div>
  );
}