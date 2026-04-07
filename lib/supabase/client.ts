import { createBrowserClient } from "@supabase/ssr";
import { getPublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  return createBrowserClient(getSupabaseUrl(), getPublishableKey());
}
