import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Profile
      </h1>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Bio:</strong> {user?.bio || "-"}
        </p>
      </div>
    </div>
  );
}