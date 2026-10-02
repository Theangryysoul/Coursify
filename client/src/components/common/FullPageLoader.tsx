import { Loader2 } from "lucide-react";

export function FullPageLoader() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
