import { forwardRef } from "react";
import {
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

import type { Video } from "@/types/course-details";
import { useToggleCompleted } from "@/hooks/progress/useToggleCompleted";

const formatDuration = (duration: string) => {
  const match = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) return duration;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

interface LectureItemProps {
  lecture: Video;
  active: boolean;
  onClick: () => void;
}

export const LectureItem = forwardRef<
  HTMLDivElement,
  LectureItemProps
>(function LectureItem(
  {
    lecture,
    active,
    onClick,
  },
  ref
) {
  const toggleCompleted =
    useToggleCompleted();

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        flex
        w-full
        cursor-pointer
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            toggleCompleted.mutate(
              lecture.videoId
            );
          }}
          className="rounded-full"
        >
          {lecture.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 transition hover:scale-110" />
          ) : (
            <PlayCircle className="h-5 w-5 text-muted-foreground transition hover:scale-110" />
          )}
        </button>

        <span className="text-left">
          {lecture.title}
        </span>
      </div>

      <span className="text-sm text-muted-foreground">
        {formatDuration(lecture.duration)}
      </span>
    </div>
  );
});