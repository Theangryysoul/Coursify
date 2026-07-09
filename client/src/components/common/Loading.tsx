import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-full items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
    </div>
  );
}