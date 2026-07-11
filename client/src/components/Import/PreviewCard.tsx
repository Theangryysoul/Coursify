import { Clock3, PlayCircle, Tv } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { YoutubePreviewResponse } from "@/types/youtube";

interface PreviewCardProps {
  preview: YoutubePreviewResponse;
}

export function PreviewCard({ preview }: PreviewCardProps) {
  const { type, data } = preview;

  return (
    <Card className="mt-8 w-full max-w-3xl overflow-hidden rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl">
      <div className="grid md:grid-cols-[400px_1fr]">
        <div className="overflow-hidden">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="aspect-video rounded w-full object-cover transition duration-300 hover:scale-105 mt-3"
          />
        </div>

        <CardContent className="flex flex-col justify-start p-5 pt-3">
          <h2 className="line-clamp-2 text-2xl font-bold leading-tight">
            {data.title}
          </h2>

          <div className="mt-3">
            <span
              className="
                rounded-full
                border
                border-primary/20
                bg-gradient-to-r
                from-blue-600/20
                to-violet-600/20
                px-3
                py-1
                text-xs
                font-semibold
                text-primary
              "
            >
              {type === "playlist"
                ? "📚 Playlist"
                : "🎬 Single Video"}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {data.channelName}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Videos
                </span>
              </div>

              <p className="text-xl font-bold">
                {data.videoCount}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Tv className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Type
                </span>
              </div>

              <p className="text-xl font-bold capitalize">
                {type}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs">
              Total duration will be calculated after import.
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}