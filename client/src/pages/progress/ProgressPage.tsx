import { Link } from "react-router-dom";

import { EmptyState } from "@/components/common/EmptyState";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StudyHeatmap } from "@/components/dashboard/StudyHeatmap";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/constants/routes";
import { useCourses } from "@/hooks/course/useCourses";

export default function ProgressPage() {
  const { data: courses, isPending } = useCourses();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div>
        <h1 className="text-4xl font-bold">Progress</h1>

        <p className="text-muted-foreground mt-2">
          Everything you have watched, at a glance.
        </p>
      </div>

      <StatsGrid />

      <StudyHeatmap />

      <section className="space-y-5">
        <h2 className="text-2xl font-bold">Course Progress</h2>

        {isPending ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-muted h-28 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : !courses?.length ? (
          <EmptyState
            title="No courses yet"
            description="Import a YouTube playlist to start tracking your progress."
          />
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course.course._id}`}
                className="border-border/60 bg-card/60 hover:border-primary/40 block rounded-3xl border p-5 backdrop-blur-xl transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={course.course.thumbnail}
                    alt={course.course.title}
                    className="h-16 w-28 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">
                      {course.course.title}
                    </h3>

                    <p className="text-muted-foreground mt-1 text-sm">
                      {course.course.completedVideos} of{" "}
                      {course.course.totalVideos} videos completed
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {course.progress.percentage}%
                  </span>
                </div>

                <Progress
                  value={course.progress.percentage}
                  className="mt-4 h-2"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="text-muted-foreground text-sm">
        Looking for something new?{" "}
        <Link
          to={ROUTES.IMPORT}
          className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
        >
          Import a course
        </Link>
      </p>
    </div>
  );
}
