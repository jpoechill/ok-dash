import { NextResponse } from "next/server";
import { fetchAppSnapshot } from "@/lib/server/app-data";
import { mutateData } from "@/lib/server/data-mutations";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const noStoreJson = { "Cache-Control": "no-store, must-revalidate" };

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    const snapshot = await fetchAppSnapshot(supabase);
    return NextResponse.json(snapshot, { headers: noStoreJson });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load data";
    return NextResponse.json({ error: message }, { status: 500, headers: noStoreJson });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();
    const result = await mutateData(supabase, body);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status, headers: noStoreJson });
    }
    return NextResponse.json({ ok: true }, { headers: noStoreJson });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400, headers: noStoreJson });
  }
}
