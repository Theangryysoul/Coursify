import { Pin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import type { CourseItem } from "@/types/course";

interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({
  course,
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-card/60 transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/courses/${course.course._id}`}>
      <img src={course.course.thumbnail}
      alt={course.course.title}
      className="aspect-video w-full object-cover cursor-pointer" />
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-h-[3.5rem] line-clamp-2 text-lg font-semibold leading-7">
            {course.course.title}
          </h3>

          <div className="flex gap-2">
            {course.favorite && (
              <Heart
                className="h-4 w-4 fill-red-500 text-red-500"
              />
            )}

            {course.pinned && (
              <Pin className="h-4 w-4 text-primary" />
            )}
          </div>
        </div>

        <Progress value={course.progress} />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{course.progress}% completed</span>

          <span>{course.status}</span>
        </div>

        <Button
          asChild
          className="w-full rounded-xl"
        >
          <Link to={`/courses/${course.course._id}`}>
            Continue Learning
          </Link>
        </Button>
      </div>
    </Card>
  );
}