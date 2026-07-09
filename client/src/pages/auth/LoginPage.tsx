import { AuthLayout } from "@/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to continue learning."
    >
      <LoginForm />
    </AuthLayout>
  );
}
