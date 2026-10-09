import { Clock3, PlayCircle, Tv } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { YoutubePreviewResponse } from "@/types/youtube";

interface PreviewCardProps {
  preview: YoutubePreviewResponse;
}

export function PreviewCard({ preview }: PreviewCardProps) {
  const { type, data } = preview;

  return (
    /*
     * `py-0` cancels the Card's own vertical padding so the thumbnail can sit
     * flush against the top of the card on a phone - it is the first thing in
     * the card and a ring of empty space above it just looked like a mistake.
     * The left column is sized in rem so it scales with the interface.
     */
    <Card className="mt-6 w-full max-w-3xl gap-0 overflow-hidden rounded-3xl border-border/60 bg-card/60 py-0 backdrop-blur-xl sm:mt-8">
      <div className="grid md:grid-cols-[25rem_1fr]">
        <div className="overflow-hidden bg-muted/40">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full object-cover aspect-video md:h-full md:aspect-auto"
          />
        </div>

        <CardContent className="flex flex-col justify-start p-4 pt-5 sm:p-6 sm:pt-6">
          <h2 className="line-clamp-2 text-xl leading-tight font-bold sm:text-2xl">
            {data.title}
          </h2>

          <div className="mt-3">
            <span
              className="
                inline-block
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
                <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Videos
                </span>
              </div>

              <p className="text-lg font-bold sm:text-xl">
                {data.videoCount}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Tv className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Type
                </span>
              </div>

              <p className="text-lg font-bold capitalize sm:text-xl">
                {type}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4 shrink-0" />
            <span className="text-xs">
              Total duration will be calculated after import.
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}