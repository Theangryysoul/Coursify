import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { RecentCourses } from "@/components/dashboard/RecentCourses";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <DashboardHeader />

      <StatsGrid />
      <ContinueLearning />
      <RecentCourses />
    </div>
  );
}