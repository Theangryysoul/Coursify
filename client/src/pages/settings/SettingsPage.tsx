import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuthStore } from "@/store/auth.store";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/lib/validations/password.schema";
import { getErrorMessage } from "@/utils/get-error-message";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>

        <p className="text-muted-foreground mt-2">
          Manage your account and preferences.
        </p>
      </div>

      <AccountCard />
      <ChangePasswordCard />
      <AppearanceCard />
      <SessionCard />
    </div>
  );
}

function AccountCard() {
  const user = useAuthStore((state) => state.user);

  return (
    <Card className="border-border/60 bg-card/60 rounded-3xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Account</CardTitle>

        <CardDescription>
          This is the email you sign in with.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="account-name">Name</Label>

          <Input
            id="account-name"
            value={user?.name ?? ""}
            readOnly
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-email">Email</Label>

          <Input
            id="account-email"
            value={user?.email ?? ""}
            readOnly
            disabled
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        reset();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <Card className="border-border/60 bg-card/60 rounded-3xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Password</CardTitle>

        <CardDescription>
          Use at least 6 characters.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>

            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />

            {errors.currentPassword && (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>

            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
            />

            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function AppearanceCard() {
  const { theme, setTheme } = useTheme();

  // next-themes only knows the stored value after mount, so the buttons are
  // rendered without an active state until then to avoid a wrong highlight.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="border-border/60 bg-card/60 rounded-3xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Appearance</CardTitle>

        <CardDescription>
          Choose how Coursify looks on this device.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const isActive = mounted && theme === value;

            return (
              <Button
                key={value}
                type="button"
                variant={isActive ? "default" : "outline"}
                className="h-11 rounded-xl px-5"
                onClick={() => setTheme(value)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function SessionCard() {
  const logoutMutation = useLogout();

  return (
    <Card className="border-border/60 bg-card/60 rounded-3xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Session</CardTitle>

        <CardDescription>
          Sign out of Coursify on this device.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          type="button"
          variant="destructive"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </CardContent>
    </Card>
  );
}
