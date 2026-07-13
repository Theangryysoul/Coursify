import { useCourses } from "@/hooks/course/useCourses";

import { RecentCourseCard } from "./RecentCourseCard";

export function RecentCourses() {
  const { data: courses, isPending } =
    useCourses();

  if (isPending) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Recent Courses
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-border/60"
            >
              <div className="aspect-video animate-pulse bg-muted" />

              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />

                <div className="h-5 w-full animate-pulse rounded bg-muted" />

                <div className="h-2 w-full animate-pulse rounded bg-muted" />

                <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const recentCourses =
    courses?.slice(0, 4) ?? [];

  if (!recentCourses.length) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Recent Courses
        </h2>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 py-20 text-center">
          <h3 className="text-xl font-semibold">
            No recent courses
          </h3>

          <p className="mt-2 text-muted-foreground">
            Imported courses will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        Recent Courses
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {recentCourses.map((course) => (
          <RecentCourseCard
            key={course._id}
            course={course}
          />
        ))}
      </div>
    </section>
  );
}