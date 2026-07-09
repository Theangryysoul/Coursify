import { AuthLayout } from "@/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start learning with Coursify."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
