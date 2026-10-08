import { useState } from "react";
import { Layers, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Folder } from "@/types/folder";
import { useDeleteFolder } from "@/hooks/folder/useDeleteFolder";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-error-message";
import { getFolderDotClass } from "./folder-colors";

/**
 * Which slice of the library is being shown. A plain string is the id of a
 * folder; the two named values cover the always-present buckets.
 */
export type FolderSelection = "all" | "uncategorised" | string;

interface FolderFilterBarProps {
  folders: Folder[];
  totalCount: number;
  uncategorisedCount: number;
  selected: FolderSelection;
  onSelect: (selection: FolderSelection) => void;
}

export function FolderFilterBar({
  folders,
  totalCount,
  uncategorisedCount,
  selected,
  onSelect,
}: FolderFilterBarProps) {
  const [folderPendingDelete, setFolderPendingDelete] =
    useState<Folder | null>(null);

  const deleteFolder = useDeleteFolder();

  const handleDelete = () => {
    if (!folderPendingDelete) return;

    const { _id, name } = folderPendingDelete;

    deleteFolder.mutate(_id, {
      onSuccess: () => {
        toast.success(`"${name}" deleted`);

        // The courses inside were moved to "Uncategorised", so showing the
        // now-empty folder would be a dead end.
        if (selected === _id) {
          onSelect("all");
        }

        setFolderPendingDelete(null);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const chipClass = (isActive: boolean) =>
    cn(
      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
      isActive
        ? "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
        : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={chipClass(selected === "all")}
        >
          <Layers className="h-4 w-4" />
          All
          <span className="opacity-70">{totalCount}</span>
        </button>

        {folders.map((folder) => {
          const isActive = selected === folder._id;

          return (
            <div key={folder._id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(folder._id)}
                className={chipClass(isActive)}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    getFolderDotClass(folder.color)
                  )}
                />

                <span className="max-w-40 truncate">{folder.name}</span>

                <span className="opacity-70">{folder.courseCount}</span>
              </button>

              <button
                type="button"
                aria-label={`Delete ${folder.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setFolderPendingDelete(folder);
                }}
                className="absolute -top-1.5 -right-1.5 hidden h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground shadow-sm transition hover:text-destructive group-hover:flex"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          );
        })}

        {uncategorisedCount > 0 && (
          <button
            type="button"
            onClick={() => onSelect("uncategorised")}
            className={chipClass(selected === "uncategorised")}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60" />
            Uncategorised
            <span className="opacity-70">{uncategorisedCount}</span>
          </button>
        )}
      </div>

      <AlertDialog
        open={Boolean(folderPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setFolderPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete "{folderPendingDelete?.name}"?
            </AlertDialogTitle>

            <AlertDialogDescription>
              The folder is removed but its courses are kept - they move back
              to Uncategorised.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={deleteFolder.isPending}
              onClick={handleDelete}
            >
              {deleteFolder.isPending ? "Deleting..." : "Delete folder"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
