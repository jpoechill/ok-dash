"use client";

import { AppShell } from "@/components/app-shell";
import { AddDanceForm } from "@/components/add-dance-form";
import { DanceLineupTable } from "@/components/dance-lineup-table";
import { useDashboard } from "@/components/dashboard-provider";
import { partitionDancesBySource } from "@/lib/dance-utils";

export default function DancesPage() {
  const { dances, teachers, ready, initialized, loadError } = useDashboard();
  const { troupe, guest } = partitionDancesBySource(dances);

  if (!initialized) {
    return (
      <AppShell title="Dances" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Dances" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dances"
      subtitle="Dance catalog with music files. Stored in Supabase."
    >
      <AddDanceForm />

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Dance catalog</h2>
        {!ready ? (
          <p className="mt-4 text-sm text-zinc-500">Loading catalog…</p>
        ) : (
          <div className="mt-4 grid gap-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">OK troupe repertoire</h3>
              <p className="mt-1 text-xs text-zinc-500">Core season pieces.</p>
              <div className="mt-3">
                <DanceLineupTable dances={troupe} teachers={teachers} variant="catalog" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Guest / collaborative organizations</h3>
              <p className="mt-1 text-xs text-zinc-500">Partner groups sharing repertoire for the show.</p>
              <div className="mt-3">
                <DanceLineupTable dances={guest} teachers={teachers} variant="catalog" />
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
