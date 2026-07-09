import {
  BookOpen,
  Clock3,
  PlayCircle,
  Trophy,
} from "lucide-react";

import { StatCard } from "./StatCard";

export function StatsGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Courses"
        value="0"
        icon={BookOpen}
      />

      <StatCard
        title="Videos"
        value="0"
        icon={PlayCircle}
      />

      <StatCard
        title="Hours"
        value="0"
        icon={Clock3}
      />

      <StatCard
        title="Completion"
        value="0%"
        icon={Trophy}
      />
    </div>
  );
}