import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type { CourseItem } from "@/types/course";

interface RecentCourseCardProps {
  course: CourseItem;
}

export function RecentCourseCard({ course }: RecentCourseCardProps) {
  const progressPercentage = course.progress.percentage;

  return (
    <div className="border-border/60 bg-card/60 overflow-hidden rounded-2xl border backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/courses/${course.course._id}`}>
        <img
          src={course.course.thumbnail}
          alt={course.course.title}
          className="aspect-video w-full object-cover"
        />
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-muted-foreground text-sm">
            {course.course.totalVideos} Videos
          </p>

          <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] text-lg font-semibold">
            {course.course.title}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>

          <Progress value={progressPercentage} />
        </div>

        <Button asChild className="w-full">
          <Link to={`/courses/${course.course._id}`}>Open Course</Link>
        </Button>
      </div>
    </div>
  );
}
