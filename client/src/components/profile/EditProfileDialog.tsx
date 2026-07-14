import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

import { useAuthStore } from "@/store/auth.store";
import { useUpdateProfile } from "@/hooks/user/useUpdateProfile";

export function EditProfileDialog() {
  const user = useAuthStore(
    (state) => state.user
  );

  const updateProfile =
    useUpdateProfile();

  const [open, setOpen] =
    useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setName(user?.name ?? "");
    setBio(user?.bio ?? "");
  }, [user]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        name,
        bio,
      },
      {
        onSuccess: () =>
          setOpen(false),
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
            size="lg"
            className="w-40 h-10 rounded-xl px-6 text-base font-medium"
            >
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => { 
          e.preventDefault();
          handleSave();
          }}
          >
          <Input
            placeholder="Name"
            className="w-full h-10 rounded-xl px-6 text-base font-medium"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <Textarea
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            className="min-h-28 rounded-xl text-base"
          />

          <Button
          type="submit"
            size="lg"
            className="w-full h-10 rounded-xl px-6 text-base font-medium"
            onClick={handleSave}
            disabled={
              updateProfile.isPending
            }
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}