import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useCourseDetails } from "@/hooks/course/useCourseDetails";
import { useResume } from "@/hooks/progress/useResume";
import { useUpdateProgress } from "@/hooks/progress/useUpdateProgress";

import { CourseHeader } from "@/components/course/CourseHeader";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { LectureItem } from "@/components/course/LectureItem";

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

export default function CourseDetailsPage() {
  const { courseId } = useParams();

  const { data, isPending } = useCourseDetails(
    courseId ?? ""
  );

  const [currentVideo, setCurrentVideo] = useState(0);
  
  useEffect(() => {
    if (
      data?.videos.length &&
      currentVideo >= data.videos.length
    ) {
      setCurrentVideo(0);
    }
  }, [data?.videos.length]);
  
  const activeVideo = data?.videos[currentVideo];
  
    const { data: resume } = useResume(
    activeVideo?.videoId ?? ""
  );
  const activeLectureRef =
  useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data?.resume) return;

    const index = data.videos.findIndex(
      (video) =>
        video._id === data.resume?.videoId
    );

    if (index !== -1) {
      setCurrentVideo(index);
    }
  }, [data]);

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
        queryKey: [
          "course-details",
          courseId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      if (currentVideo < data.videos.length - 1) {
        setCurrentVideo((prev) => prev + 1);
      }
    };

  if (isPending) {
    return (
      <div className="text-center text-muted-foreground">
        Loading course...
      </div>
    );
  }

  if (!data || !activeVideo) {
    return (
      <div className="text-center text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <CourseHeader
        title={data.userCourse.course.title}
        progress={data.progress}
        duration={formatDuration(activeVideo.duration)}
      />

      <CoursePlayer
        videoId={activeVideo.videoId}
        title={activeVideo.title}
        resumeTime={resume?.currentTime}
        onProgress={handleProgress}
        onCompleted={handleCompleted}
      />

      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Course Content
          </h2>

          <span className="text-muted-foreground">
            {data.videos.length} Video
            {data.videos.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
          {data.videos.map((lecture, index) => (
            <LectureItem
              ref={
                currentVideo === index
                  ? activeLectureRef
                  : null
              }
              key={lecture._id}
              lecture={lecture}
              active={currentVideo === index}
              onClick={() => setCurrentVideo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}