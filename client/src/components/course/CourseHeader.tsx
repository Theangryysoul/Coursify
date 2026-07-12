import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseHeaderProps {
  title: string;
  progress: number;
}

export function CourseHeader({
  title,
  progress,
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

        <p className="mt-2 text-muted-foreground">
          {progress}% Completed
        </p>

        <Progress
          value={progress}
          className="mt-4"
        />
      </div>
    </div>
  );
}