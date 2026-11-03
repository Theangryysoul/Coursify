import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useCourseDetails } from "@/hooks/course/useCourseDetails";
import { useResume } from "@/hooks/progress/useResume";
import { useUpdateProgress } from "@/hooks/progress/useUpdateProgress";

import { CourseHeader } from "@/components/course/CourseHeader";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { LectureItem } from "@/components/course/LectureItem";

const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  return `${minutes}m ${secs}s`;
};

export default function CourseDetailsPage() {
  const { courseId } = useParams();

  const { data, isPending } = useCourseDetails(courseId ?? "");

  // `null` means "follow the saved resume point". Once the viewer picks a
  // lecture we keep playing that one, even if the course data refetches.
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const resumeIndex =
    data?.videos.findIndex((video) => video._id === data.resume?.videoId) ?? -1;

  const currentVideo = data?.videos.length
    ? Math.min(
        selectedVideo ?? Math.max(resumeIndex, 0),
        data.videos.length - 1
      )
    : 0;

  const activeVideo = data?.videos[currentVideo];

  const { data: resume } = useResume(activeVideo?.videoId ?? "");

  const activeLectureRef = useRef<HTMLDivElement | null>(null);

  // Keep the playing lecture visible inside the queue when it changes.
  useEffect(() => {
    activeLectureRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentVideo]);

  const updateProgress = useUpdateProgress();

  const queryClient = useQueryClient();

  const handleProgress = (
    currentTime: number,
    duration: number,
    start: number,
    end: number
  ) => {
    if (!activeVideo) return;

    if (updateProgress.isPending) return;

    updateProgress.mutate({
      videoId: activeVideo.videoId,
      data: {
        currentTime,
        duration,
        segment: {
          start,
          end,
        },
      },
    });
  };

  const handleCompleted = async () => {
    if (!data) return;

    await queryClient.invalidateQueries({
      queryKey: ["course-details", courseId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["courses"],
    });

    if (currentVideo < data.videos.length - 1) {
      setSelectedVideo(currentVideo + 1);
    }
  };

  if (isPending) {
    return (
      <div className="text-muted-foreground text-center">Loading course...</div>
    );
  }

  if (!data || !activeVideo) {
    return (
      <div className="text-muted-foreground text-center">Course not found.</div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <CourseHeader
        title={data.userCourse.course.title}
        progress={data.progress}
        duration={`${formatSeconds(
          data.progress.watchedDuration
        )} / ${formatSeconds(data.progress.totalDuration)}`}
      />

      {/* Player on the left, playlist queue on the right - the YouTube layout.
          The queue width scales with the available space instead of using a
          fixed width, so the layout keeps filling the page at any zoom level. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(18rem,26%,26rem)]">
        <div className="min-w-0">
          <CoursePlayer
            videoId={activeVideo.videoId}
            title={activeVideo.title}
            resumeTime={resume?.currentTime}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />
        </div>

        <aside className="border-border/60 bg-card/60 overflow-hidden rounded-3xl border backdrop-blur-xl lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col">
          <div className="border-border/60 flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Course Content</h2>

            <span className="text-muted-foreground text-sm">
              {data.videos.length} Video
              {data.videos.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto p-2 lg:min-h-0 lg:flex-1">
            {data.videos.map((lecture, index) => (
              <LectureItem
                ref={currentVideo === index ? activeLectureRef : null}
                key={lecture._id}
                lecture={lecture}
                active={currentVideo === index}
                onClick={() => setSelectedVideo(index)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
