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

import { useUploadAvatar } from "@/hooks/user/useUploadAvatar";
import { useDeleteAvatar } from "@/hooks/user/useDeleteAvatar";
import { useAuthStore } from "@/store/auth.store";
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

  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    const MAX_SIZE = 300 * 1024;

    if (selected.size > MAX_SIZE) {
      toast.error(
        "Image size must be less than 300 KB."
      );

      e.target.value = "";
      return;
    }

    setFile(selected);
    setPreview(
      URL.createObjectURL(selected)
    );
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
            onClick={() =>
              inputRef.current?.click()
            }
          >
            Choose Image
          </Button>

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full rounded-xl px-6 text-base font-medium"
            disabled={
              !file ||
              uploadAvatar.isPending
            }
            onClick={handleUpload}
          >
            Upload Avatar
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