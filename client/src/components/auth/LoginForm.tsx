import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { useLogin } from "@/hooks/auth/useLogin";
import { loginSchema, type LoginSchema } from "@/lib/validations/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";

import { getErrorMessage } from "@/utils/get-error-message";

export function LoginForm() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Login successful");
        navigate(ROUTES.DASHBOARD);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium text-zinc-200" htmlFor="email">
          Email
        </Label>

        <Input
          className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-zinc-200" htmlFor="password">
          Password
        </Label>

        <Input
          className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 font-semibold text-foreground shadow-lg transition-all hover:from-blue-500 hover:to-violet-500"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Login"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        Don't have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
