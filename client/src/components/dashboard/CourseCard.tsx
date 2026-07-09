import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  playlist: string;
  progress: number;
}

export function CourseCard({ title, playlist, progress }: CourseCardProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-600/20 to-violet-600/20">
        <PlayCircle className="h-14 w-14 text-violet-400" />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-muted-foreground text-sm">{playlist}</p>

          <h3 className="mt-1 line-clamp-2 text-lg font-semibold">{title}</h3>
        </div>

        <Progress value={progress} />

        <Button className="w-full">Open Course</Button>
      </div>
    </div>
  );
}
