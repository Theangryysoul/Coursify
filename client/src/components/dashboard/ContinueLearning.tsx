import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useCourses } from "@/hooks/course/useCourses";

export function ContinueLearning() {
  const { data: courses, isPending } = useCourses();

  if (isPending) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Continue Learning
        </h2>

        <div className="h-72 animate-pulse rounded-3xl bg-muted" />
      </section>
    );
  }

  const course = courses?.find(
    (course) =>
      course.progress.percentage < 100 &&
      !course.archived
  );

    if (!course) {
      return (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Continue Learning
          </h2>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 py-20 text-center">
            <h3 className="text-xl font-semibold">
              No courses yet 📚
            </h3>

            <p className="mt-2 max-w-md text-muted-foreground">
              Import your first YouTube playlist or video
              and start learning distraction-free.
            </p>

            <Button
              asChild
              className="mt-6 rounded-xl"
            >
              <Link to="/import">
                Import Course
              </Link>
            </Button>
          </div>
        </section>
      );
    }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        Continue Learning
      </h2>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl">
        <div className="grid md:grid-cols-[320px_1fr]">
          <Link
            to={`/courses/${course.course._id}`} >
          <img
            src={course.course.thumbnail}
            alt={course.course.title}
            className="h-full w-full object-cover"
          />  
          </Link>
          
          

          <div className="flex flex-col justify-between p-8">
            <div>
              <p className="text-sm text-muted-foreground">
                {course.course.totalVideos} Videos
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {course.course.title}
              </h3>

              <p className="mt-3 text-muted-foreground">
                Continue where you left off.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <Progress value={course.progress.percentage} />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {course.progress.percentage}% completed
                </span>

                <span>
                  {course.status}
                </span>
              </div>

              <Button
                asChild
                className="mt-3 gap-2"
              >
                <Link
                  to={`/courses/${course.course._id}`}
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}