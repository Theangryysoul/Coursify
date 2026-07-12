import { forwardRef } from "react";
import {
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

import type { Video } from "@/types/course-details";

interface LectureItemProps {
  lecture: Video;
  active: boolean;
  onClick: () => void;
}

export const LectureItem = forwardRef<
  HTMLButtonElement,
  LectureItemProps
>(function LectureItem(
  {
    lecture,
    active,
    onClick,
  },
  ref
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        justify-between
        rounded-xl
        p-4
        transition

        ${
          active
            ? `
              border
              border-primary/40
              bg-primary/10
              shadow-md
              ring-1
              ring-primary/20
            `
            : "hover:bg-muted"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {lecture.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <PlayCircle className="h-5 w-5" />
        )}

        <span className="text-left">
          {lecture.title}
        </span>
      </div>

      <span className="text-sm text-muted-foreground">
        {lecture.duration}
      </span>
    </button>
  );
});