import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FOLDER_COLORS, type FolderColor } from "@/types/folder";
import { useCreateFolder } from "@/hooks/folder/useCreateFolder";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-error-message";
import { getFolderDotClass } from "./folder-colors";

export function CreateFolderDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<FolderColor>("violet");

  const createFolder = useCreateFolder();

  const reset = () => {
    setName("");
    setColor("violet");
  };

  const handleCreate = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      toast.error("Please enter a folder name");
      return;
    }

    createFolder.mutate(
      { name: trimmed, color },
      {
        onSuccess: () => {
          toast.success("Folder created");
          setOpen(false);
          reset();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);

        if (!next) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-10 w-full gap-2 rounded-xl px-6 text-base font-medium sm:w-auto"
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Create Folder
          </DialogTitle>

          <DialogDescription>
            Group related courses so they are easier to find.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="folder-name">Name</Label>

            <Input
              id="folder-name"
              className="h-10 rounded-xl px-4 text-base"
              placeholder="e.g. Web Development"
              value={name}
              maxLength={60}
              autoFocus
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Colour</Label>

            <div className="flex flex-wrap gap-3">
              {FOLDER_COLORS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={option}
                  aria-pressed={color === option}
                  onClick={() => setColor(option)}
                  className={cn(
                    "h-8 w-8 rounded-full transition",
                    getFolderDotClass(option),
                    color === option
                      ? "ring-2 ring-offset-2 ring-offset-background ring-foreground/40"
                      : "opacity-70 hover:opacity-100"
                  )}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full rounded-xl px-6 text-base font-medium"
            disabled={createFolder.isPending}
          >
            {createFolder.isPending ? "Creating..." : "Create Folder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
