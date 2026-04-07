import { createClient } from "@supabase/supabase-js";
import { getSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

/** Server-only: bypasses RLS. Never import from client components. */
export function createAdminSupabaseClient() {
  return createClient(getSupabaseUrl(), getSecretKey());
}
