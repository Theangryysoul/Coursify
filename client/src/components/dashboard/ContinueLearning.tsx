import { ArrowRight, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function ContinueLearning() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Continue Learning</h2>

      <div className="bg-card border-border overflow-hidden rounded-3xl border backdrop-blur-md">
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-600/20 to-violet-600/20">
            <PlayCircle className="h-16 w-16 text-violet-400" />
          </div>

          <div className="space-y-6 p-6">
            <div>
              <p className="text-muted-foreground text-sm">Playlist</p>

              <h3 className="mt-2 text-2xl font-semibold">
                MERN Backend Bootcamp
              </h3>

              <p className="text-muted-foreground mt-2">
                Authentication • Video 14
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={72} />

              <p className="text-muted-foreground text-sm">72% completed</p>
            </div>

            <Button className="gap-2">
              Continue Watching
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
