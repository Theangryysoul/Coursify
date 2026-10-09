import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { RecentCourses } from "@/components/dashboard/RecentCourses";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StudyHeatmap } from "@/components/dashboard/StudyHeatmap";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 lg:space-y-10">
      <DashboardHeader />
      <StatsGrid />
      <StudyHeatmap />
      <ContinueLearning />
      <RecentCourses />
    </div>
  );
}
