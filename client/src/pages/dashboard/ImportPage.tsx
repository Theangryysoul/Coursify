import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useYoutubePreview } from "@/hooks/youtube/useYoutubePreview";
import { useImportYoutube } from "@/hooks/youtube/useImportYoutube";

import { getErrorMessage } from "@/utils/get-error-message";

export default function ImportPage() {
  const [url, setUrl] = useState("");

  const previewMutation = useYoutubePreview();
  const importMutation = useImportYoutube();

  const handlePreview = () => {
    previewMutation.mutate(url, {
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleImport = () => {
    importMutation.mutate(url, {
      onSuccess: () => {
        toast.success("Course imported successfully");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Import Course
        </h1>

        <p className="text-muted-foreground mt-2">
          Paste any YouTube playlist or video link.
        </p>
      </div>

      <Input
        placeholder="https://youtube.com/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="flex gap-3">
        <Button
          onClick={handlePreview}
          disabled={previewMutation.isPending}
        >
          Preview
        </Button>

        <Button
          onClick={handleImport}
          disabled={
            !previewMutation.data ||
            importMutation.isPending
          }
        >
          Import
        </Button>
      </div>
    </div>
  );
}