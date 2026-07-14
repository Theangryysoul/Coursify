import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseHeaderProps {
  title: string;
  progress: {
    percentage: number;
    watchedDuration: number;
    totalDuration: number;
  };
  duration: string;
}

export function CourseHeader({
  title,
  progress,
  duration,
}: CourseHeaderProps) {
  return (
    <div className="space-y-5">
      <Button
        asChild
        variant="ghost"
        className="w-fit"
      >
        <Link to="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <div className="mt-2 flex items-center gap-4 text-muted-foreground">
          <span>{progress.percentage}% Completed</span>
          <span>•</span>
          <span>{duration}</span>
        </div>

        <Progress
          value={progress.percentage}
          className="mt-4"
        />
      </div>
    </div>
  );
}