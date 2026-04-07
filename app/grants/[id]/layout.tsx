import type { Metadata } from "next";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const sb = createAdminSupabaseClient();
    const { data } = await sb.from("grants").select("name, focus").eq("id", id).maybeSingle();
    if (!data || typeof data.name !== "string") {
      return {
        title: "Grant",
        description: "Grant details",
      };
    }
    const focus = typeof data.focus === "string" ? data.focus : "";
    const description = focus.length > 160 ? `${focus.slice(0, 157)}…` : focus;
    return {
      title: `${data.name} · Grants`,
      description: description || "Grant details",
    };
  } catch {
    return {
      title: "Grant",
      description: "Grant details",
    };
  }
}

export default function GrantDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
