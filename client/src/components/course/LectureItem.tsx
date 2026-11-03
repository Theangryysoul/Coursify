import { forwardRef } from "react";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Video } from "@/types/course-details";
import { useToggleCompleted } from "@/hooks/progress/useToggleCompleted";

const formatDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return duration;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

interface LectureItemProps {
  lecture: Video;
  active: boolean;
  onClick: () => void;
}

export const LectureItem = forwardRef<HTMLDivElement, LectureItemProps>(
  function LectureItem({ lecture, active, onClick }, ref) {
    const toggleCompleted = useToggleCompleted();

    const thumbnail =
      lecture.thumbnail ||
      `https://i.ytimg.com/vi/${lecture.videoId}/mqdefault.jpg`;

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          "group flex w-full cursor-pointer items-start gap-3 rounded-xl p-2 transition",
          active ? "bg-primary/10 ring-primary/30 ring-1" : "hover:bg-muted"
        )}
      >
        <div className="bg-muted relative w-28 shrink-0 overflow-hidden rounded-lg">
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover"
          />

          <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white">
            {formatDuration(lecture.duration)}
          </span>

          {active && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/35">
              <PlayCircle className="h-7 w-7 text-white" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <p
            className={cn(
              "line-clamp-2 text-sm leading-snug",
              active ? "text-foreground font-semibold" : "font-medium"
            )}
          >
            {lecture.title}
          </p>

          <span className="text-muted-foreground mt-1 block text-xs">
            {active ? "Now playing" : lecture.completed ? "Completed" : "Video"}
          </span>
        </div>

        <button
          type="button"
          aria-label={
            lecture.completed ? "Mark as not completed" : "Mark as completed"
          }
          title={
            lecture.completed ? "Mark as not completed" : "Mark as completed"
          }
          onClick={(e) => {
            e.stopPropagation();

            toggleCompleted.mutate(lecture.videoId);
          }}
          className="mt-1 shrink-0 rounded-full"
        >
          {lecture.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 transition hover:scale-110" />
          ) : (
            <Circle className="text-muted-foreground h-5 w-5 transition hover:scale-110" />
          )}
        </button>
      </div>
    );
  }
);
