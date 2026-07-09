import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/auth.schema";

import { useRegister } from "@/hooks/auth/useRegister";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/utils/get-error-message";

export function RegisterForm() {
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Account created successfully");
        navigate(ROUTES.LOGIN);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium text-zinc-200"htmlFor="name">Name</Label>

        <Input
          className=" h-12 rounded-xl border-border bg-card text-foreground placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
          id="name"
          type="text"
          placeholder="Enter your name"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-destructive text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-zinc-200" htmlFor="email">Email</Label>

        <Input
          className=" h-12 rounded-xl border-border bg-card text-foreground placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-destructive text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-zinc-200" htmlFor="password">Password</Label>

        <Input
          className=" h-12 rounded-xl border-border bg-card text-foreground placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-foreground font-semibold shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending
          ? "Creating account..."
          : "Create Account"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className=" font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Login
        </Link>
      </p>
    </form>
  );
}