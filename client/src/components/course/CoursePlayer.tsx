import { useEffect, useRef } from "react";
import YouTube, {
  type YouTubeEvent,
  type YouTubePlayer,
  type YouTubeProps,
} from "react-youtube";

interface CoursePlayerProps {
  videoId: string;
  title: string;
  resumeTime?: number;

  onProgress: (
    currentTime: number,
    duration: number,
    start: number,
    end: number
  ) => void;

  onCompleted: () => void;
}

export function CoursePlayer({
  videoId,
  title,
  resumeTime,
  onProgress,
  onCompleted,
}: CoursePlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);

  const timerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const lastReportedTime = useRef(0);
  const previousCurrentTime = useRef(0);

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      rel: 0,
      playsinline: 1,
      iv_load_policy: 3,
      cc_load_policy: 0,
      fs: 1,
    },
  };

  const stopTracking = () => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  };

const startTracking = () => {
  if (timerRef.current) return;

  timerRef.current = setInterval(() => {
    if (!playerRef.current) return;

    const currentTime =
      playerRef.current.getCurrentTime();

    const duration =
      playerRef.current.getDuration();

    const jump = Math.abs(
      currentTime - previousCurrentTime.current
    );

    // User probably seeked
    if (jump > 10) {
      previousCurrentTime.current = currentTime;
      lastReportedTime.current = currentTime;
      return;
    }

    if (
      currentTime - lastReportedTime.current >= 5
    ) {
      onProgress(
        currentTime,
        duration,
        lastReportedTime.current,
        currentTime
      );

      lastReportedTime.current = currentTime;
    }

    previousCurrentTime.current = currentTime;
  }, 1000);
};

  const handleReady = (
    event: YouTubeEvent
  ) => {
    playerRef.current = event.target;

    if (resumeTime && resumeTime > 5) {
      event.target.seekTo(resumeTime, true);
  lastReportedTime.current = resumeTime;
  previousCurrentTime.current = resumeTime;
    }
  };

  const handleStateChange = (
    event: YouTubeEvent
  ) => {
    switch (event.data) {
      case 1: // Playing
        startTracking();
        break;

      case 2: // Paused
      case 3: // Buffering
        stopTracking();
        break;
    }
  };

  const handleEnd = () => {
    stopTracking();
    onCompleted();
  };

  useEffect(() => {
    playerRef.current = null;
  lastReportedTime.current = 0;
  previousCurrentTime.current = 0;
    stopTracking();
  }, [videoId]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      <div className="aspect-video w-full">
        <div className="h-full w-full">
          <YouTube
            videoId={videoId}
            opts={opts}
            title={title}
            onReady={handleReady}
            onStateChange={handleStateChange}
            onEnd={handleEnd}
            className="youtube-player h-full w-full"
            iframeClassName="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}