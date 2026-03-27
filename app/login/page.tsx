import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-amber-50/40 px-4 text-sm text-zinc-600">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
