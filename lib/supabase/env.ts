/**
 * Resolves Supabase credentials from env.
 *
 * Supabase now labels keys **Publishable** (`sb_publishable_…`) and **Secret** (`sb_secret_…`).
 * The JS client accepts those the same way as the older **anon** / **service_role** JWTs.
 *
 * Prefer the new names; fallbacks keep existing deployments working.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL (Supabase project URL)");
  }
  return url;
}

/** Browser / server user-facing client: Publishable key, or legacy anon JWT. */
export function getPublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "(Supabase → Settings → API → Publishable / anon public)",
    );
  }
  return key;
}

/** Server-only admin client: Secret key, or legacy service_role JWT / same value as dashboard “Secret”. */
export function getSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY " +
        "(Supabase → Settings → API → Secret — never expose as NEXT_PUBLIC_*)",
    );
  }
  return key;
}
