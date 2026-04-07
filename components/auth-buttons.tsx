"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SiteAuthState =
  | { checked: false }
  | { checked: true; authEnabled: boolean; authenticated: boolean };

export function AuthButtons() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [siteAuth, setSiteAuth] = useState<SiteAuthState>({ checked: false });

  useEffect(() => {
    fetch("/api/site-auth")
      .then((r) => r.json())
      .then((data: { authEnabled?: boolean; authenticated?: boolean }) => {
        setSiteAuth({
          checked: true,
          authEnabled: !!data.authEnabled,
          authenticated: !!data.authenticated,
        });
      })
      .catch(() =>
        setSiteAuth({ checked: true, authEnabled: false, authenticated: false }),
      );
  }, []);

  async function handleLogout() {
    const hasGoogle = !!session?.user;
    const hasSite =
      siteAuth.checked && siteAuth.authEnabled && siteAuth.authenticated;

    if (hasSite) {
      await fetch("/api/site-auth", { method: "DELETE" });
    }
    if (hasGoogle) {
      await signOut({ callbackUrl: "/" });
      return;
    }
    router.refresh();
  }

  if (status === "loading" || !siteAuth.checked) {
    return (
      <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500">…</span>
    );
  }

  const siteLoggedIn = siteAuth.authEnabled && siteAuth.authenticated;
  const showLogout = !!session?.user || siteLoggedIn;

  if (showLogout) {
    return (
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:border-amber-300"
      >
        Log out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:border-amber-300"
      aria-label="Sign in with Google"
    >
      Sign in
    </button>
  );
}
