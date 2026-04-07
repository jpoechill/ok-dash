"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Could not sign in");
        return;
      }
      const from = searchParams.get("from");
      const dest =
        from && from.startsWith("/") && !from.startsWith("//") && !from.includes(":") ? from : "/";
      router.push(dest);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50/40 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Link href="/" className="mb-6 flex justify-center">
          <Image src="/logo.svg" alt="Pom" width={200} height={64} className="h-12 w-auto object-contain" />
        </Link>
        <h1 className="text-center text-lg font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-1 text-center text-sm text-zinc-600">Enter the site password to continue.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base"
              required
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-full bg-amber-800 px-4 py-2.5 text-base font-medium text-white hover:bg-amber-900 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
