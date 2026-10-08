import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseCardMenu } from "@/components/course/CourseCardMenu";

import type { CourseItem } from "@/types/course";

interface RecentCourseCardProps {
  course: CourseItem;
  /** Position in the list, used to stagger the entrance animation. */
  index?: number;
}

export function RecentCourseCard({
  course,
  index = 0,
}: RecentCourseCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const progressPercentage = course.progress.percentage;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
        // Cards arrive one after another instead of all at once, which reads
        // as a single motion rather than four separate flashes.
        delay: prefersReducedMotion ? 0 : Math.min(index, 3) * 0.05,
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className="h-full"
    >
      <div className="border-border/60 bg-card/60 flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-xl transition-shadow hover:shadow-lg">
        <div className="relative">
          <Link to={`/courses/${course.course._id}`}>
            <img
              src={course.course.thumbnail}
              alt={course.course.title}
              loading="lazy"
              className="aspect-video w-full object-cover"
            />
          </Link>

          <CourseCardMenu course={course} />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <p className="text-muted-foreground text-sm">
              {course.course.totalVideos} Videos
            </p>

            <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] text-lg font-semibold">
              {course.course.title}
            </h3>
          </div>

          <div className="mt-auto space-y-4">
            <div className="space-y-2">
              <div className="text-muted-foreground flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>

              <Progress value={progressPercentage} />
            </div>

            <Button asChild className="w-full rounded-xl">
              <Link to={`/courses/${course.course._id}`}>Open Course</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
