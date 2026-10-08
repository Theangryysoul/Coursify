import { Pin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CourseCardMenu } from "./CourseCardMenu";

import type { CourseItem } from "@/types/course";

interface CourseCardProps {
  course: CourseItem;
}

export function CourseCard({
  course,
}: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="border-border/60 bg-card/60 flex h-full flex-col overflow-hidden rounded-3xl shadow-sm transition-shadow hover:shadow-xl">
        <div className="relative">
          <Link to={`/courses/${course.course._id}`}>
            <img
              src={course.course.thumbnail}
              alt={course.course.title}
              loading="lazy"
              className="aspect-video w-full cursor-pointer object-cover"
            />
          </Link>

          <CourseCardMenu course={course} />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-7 font-semibold">
              {course.course.title}
            </h3>

            <div className="flex shrink-0 gap-2">
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

          <div className="mt-auto space-y-4">
            <Progress
              value={course.progress.percentage}
            />

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>
                {course.progress.percentage}% completed
              </span>

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
        </div>
      </Card>
    </motion.div>
  );
}
