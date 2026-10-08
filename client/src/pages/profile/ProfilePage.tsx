import type { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
} from "lucide-react";

import { Link } from "react-router-dom";

import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";
import { useLearningStats } from "@/hooks/progress/useLearningStats";

export default function ProfilePage() {
  const user = useAuthStore(
    (state) => state.user
  );

  const { data: stats } =
    useLearningStats();

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

    {/* Stats cards go here */}
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <Link to="/courses">
      <StatCard
        icon={<BookOpen className="h-6 w-6" />}
        title="Courses"
        value={stats?.totalCourses ?? 0}
      />
    </Link>

    <StatCard
      icon={
        <CheckCircle2 className="h-6 w-6" />
      }
      title="Videos Completed"
      value={stats?.completedVideos ?? 0}
    />

    <StatCard
      icon={<Clock3 className="h-6 w-6" />}
      title="Watch Time"
      value={
        stats?.formattedWatchTime ??
        "0h 0m"
      }
    />

    <StatCard
      icon={<Flame className="h-6 w-6" />}
      title="Current Streak"
      value={`${stats?.streak ?? 0} days`}
    />
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

function StatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="h-full rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl transition hover:border-primary/40">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold">
        {value}
      </h3>
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
