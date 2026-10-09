import { useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useYoutubePreview } from "@/hooks/youtube/useYoutubePreview";
import { useImportYoutube } from "@/hooks/youtube/useImportYoutube";
import { PreviewCard } from "@/components/Import/PreviewCard";

import { getErrorMessage } from "@/utils/get-error-message";

export default function ImportPage() {
  const [url, setUrl] = useState("");

  const previewMutation = useYoutubePreview();
  const importMutation = useImportYoutube();

  const handlePreview = () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    previewMutation.mutate(url, {
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const navigate = useNavigate();

  const handleImport = () => {
    importMutation.mutate(url, {
      onSuccess: () => {
        toast.success("Course imported successfully");

        navigate(ROUTES.COURSES);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center pt-2 sm:pt-8 lg:pt-16">

      <div className="mb-6 text-center sm:mb-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Import YouTube Course
        </h1>

        <p className="text-muted-foreground mt-2 text-sm sm:mt-3 sm:text-base">
          Paste any YouTube playlist or single video and
          continue learning distraction-free.
        </p>
      </div>

      <Card className="w-full max-w-3xl rounded-3xl border-border/60 bg-card/60 backdrop-blur-xl">
        <CardContent className="space-y-5 p-4 sm:space-y-6 sm:p-8">

          <div className="relative">
            <Link2 className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Paste YouTube playlist or video URL..."
              className="h-14 rounded-2xl pr-4 pl-12 text-base"
              value={url}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePreview();
                }
              }}
              onChange={(e) => setUrl(e.target.value)}
              disabled={
                previewMutation.isPending ||
                importMutation.isPending
              }
            />
          </div>

          {/*
           * Stacked on a phone, side by side once there is room. The import
           * button stays disabled until a preview has come back, which is also
           * what turns the pairing into a visible two-step.
           */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">

            <Button
              className="h-12 w-full rounded-2xl sm:flex-1"
              onClick={handlePreview}
              disabled={previewMutation.isPending}
            >
              {previewMutation.isPending
                ? "Previewing..."
                : "Preview Course"}
            </Button>

            <Button
              className="h-12 w-full rounded-2xl sm:flex-1"
              onClick={handleImport}
              disabled={
                !previewMutation.data ||
                importMutation.isPending
              }
            >
              {importMutation.isPending
                ? "Importing..."
                : "✨ Import Course"}
            </Button>

          </div>

        </CardContent>

      </Card>
      {previewMutation.data && (
        <PreviewCard
        preview={previewMutation.data}
        />
      )}

    </div>
  );
}