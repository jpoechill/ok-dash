"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useDashboard } from "@/components/dashboard-provider";

export default function ProgramPage() {
  const { programMilestones, initialized, loadError, ready } = useDashboard();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    setCompletedIds(programMilestones.filter((item) => item.completed).map((item) => item.id));
  }, [programMilestones]);

  const completionRate = useMemo(() => {
    if (programMilestones.length === 0) return 0;
    return Math.round((completedIds.length / programMilestones.length) * 100);
  }, [completedIds, programMilestones]);

  if (!initialized) {
    return (
      <AppShell title="Program" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Program" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Program" subtitle="Season delivery plan with weekly priorities and ownership.">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Milestones</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{ready ? programMilestones.length : "…"}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{ready ? completedIds.length : "…"}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Progress</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">{ready ? `${completionRate}%` : "…"}</p>
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Weekly milestones</h2>
        <p className="mt-1 text-sm text-zinc-600">Toggle milestones to model weekly readiness (this session only).</p>
        {!ready ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {programMilestones.map((item) => {
              const isChecked = completedIds.includes(item.id);
              return (
                <li key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setCompletedIds((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((currentId) => currentId !== item.id)
                            : [...prev, item.id],
                        )
                      }
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-amber-800 focus:ring-amber-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-zinc-900">{item.focus}</span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        Week of {item.weekOf} · {item.owner}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
