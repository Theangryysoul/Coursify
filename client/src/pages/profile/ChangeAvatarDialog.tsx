import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useUploadAvatar } from "@/hooks/user/useUploadAvatar";
import { useDeleteAvatar } from "@/hooks/user/useDeleteAvatar";
import { useAuthStore } from "@/store/auth.store";
import { compressAvatar } from "@/utils/compress-avatar";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "sonner";

export function ChangeAvatarDialog() {
  const uploadAvatar = useUploadAvatar();

  const user = useAuthStore(
    (state) => state.user
  );

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [file, setFile] =
    useState<File>();

  const [preview, setPreview] =
    useState(user?.avatar?.url);

  const [isOptimizing, setIsOptimizing] =
    useState(false);

  // Picking a second image while the first is still being shrunk would
  // otherwise let the slower one finish last and win.
  const selectionRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    setPreview(user?.avatar?.url);
  }, [open, user?.avatar?.url]);

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    const selection = selectionRef.current + 1;
    selectionRef.current = selection;

    // Show the chosen picture straight away; the shrinking below only
    // changes what gets uploaded, not what the user sees.
    setPreview(URL.createObjectURL(selected));
    setFile(undefined);
    setIsOptimizing(true);

    try {
      const optimized = await compressAvatar(selected);

      if (selectionRef.current !== selection) return;

      setFile(optimized);
    } catch (error) {
      if (selectionRef.current !== selection) return;

      toast.error(getErrorMessage(error));

      setPreview(user?.avatar?.url);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      if (selectionRef.current === selection) {
        setIsOptimizing(false);
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;

    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast.success(
          "Avatar updated successfully."
        );

        setOpen(false);
        setFile(undefined);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },

      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const deleteAvatar =
    useDeleteAvatar();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="h-10 w-40 rounded-xl px-6 text-base font-medium"
        >
          Change Avatar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change Avatar
          </DialogTitle>
        </DialogHeader>

          <div
            className="flex flex-col items-center gap-6"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                file &&
                !isOptimizing &&
                !uploadAvatar.isPending
              ) {
                e.preventDefault();
                handleUpload();
              }
            }}
          >
          <img
            src={preview}
            alt="Avatar Preview"
            className="h-36 w-36 rounded-full object-cover"
          />

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleSelect}
          />

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10 rounded-xl px-6 text-base font-medium"
            disabled={isOptimizing}
            onClick={() =>
              inputRef.current?.click()
            }
          >
            Choose Image
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Any size works — we shrink it to
            under 300 KB for you.
          </p>

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full rounded-xl px-6 text-base font-medium"
            disabled={
              !file ||
              isOptimizing ||
              uploadAvatar.isPending
            }
            onClick={handleUpload}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimizing…
              </>
            ) : (
              "Upload Avatar"
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="h-10 w-full rounded-xl px-6 text-base font-medium"
              >
                Delete Avatar
              </Button>
            </AlertDialogTrigger>
              
            <AlertDialogContent>
              <div className="h-25 p-3"><AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Avatar?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently remove your profile picture.
                  You can upload a new one anytime.
                </AlertDialogDescription>
              </AlertDialogHeader></div>

              <AlertDialogFooter>
                <AlertDialogCancel
                className="h-9 rounded-xl px-5 text-base font-medium">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90 h-9 rounded-xl px-5 text-base font-medium"
                  onClick={() =>
                    deleteAvatar.mutate(undefined, {
                      onSuccess: () => {
                        toast.success(
                          "Avatar removed successfully."
                        );

                        setFile(undefined);
                        setPreview(undefined);

                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }

                        setOpen(false);
                      },
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}