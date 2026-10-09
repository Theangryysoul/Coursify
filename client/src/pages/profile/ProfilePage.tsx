import { useAuthStore } from "@/store/auth.store";

import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";

export default function ProfilePage() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
  <div className="mx-auto max-w-6xl space-y-8">
    <h1 className="text-3xl font-bold sm:text-4xl">
      My Profile
    </h1>

    <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl sm:p-10">
      <div className="flex flex-col items-center text-center">
        <img
          src={
            user?.avatar?.url ??
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user?.name ?? "U")
          }
          alt={user?.name}
          className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover sm:h-36 sm:w-36"
        />

        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
          {user?.name}
        </h2>

        <p className="mt-2 text-muted-foreground">
          {user?.email}
        </p>

        {user?.bio && (
          <p className="mt-3 max-w-xl text-center text-muted-foreground">
            {user.bio}
          </p>
        )}

        {/* Wraps on narrow screens so the two dialogs never overflow, and
            stays centred while stacked. */}
        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
          <EditProfileDialog />

          <ChangeAvatarDialog />
        </div>
      </div>
    </div>

  <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl sm:p-8">
    <h2 className="mb-6 text-2xl font-semibold">
      Account Information
    </h2>

    <div className="grid gap-6 sm:grid-cols-2">
      <InfoItem
        label="Full Name"
        value={user?.name ?? "-"}
      />

      <InfoItem
        label="Email"
        value={user?.email ?? "-"}
      />

      <InfoItem
        label="Joined"
        value={
          user?.createdAt
            ? new Date(
                user.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )
            : "-"
        }
      />

      <InfoItem
        label="Account Status"
        value="Active"
      />
    </div>
  </div>
  </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 truncate text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}
