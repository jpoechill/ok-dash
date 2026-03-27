"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { programMilestones } from "@/lib/admin-mock-data";

export default function ProgramPage() {
  const [completedIds, setCompletedIds] = useState<string[]>(
    programMilestones.filter((item) => item.completed).map((item) => item.id),
  );

  const completionRate = useMemo(() => {
    if (programMilestones.length === 0) return 0;
    return Math.round((completedIds.length / programMilestones.length) * 100);
  }, [completedIds]);

  return (
    <AppShell title="Program" subtitle="Season delivery plan with weekly priorities and ownership.">
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Milestones</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{programMilestones.length}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{completedIds.length}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Progress</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">{completionRate}%</p>
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Weekly milestones</h2>
        <p className="mt-1 text-sm text-zinc-600">Toggle milestones to model weekly readiness.</p>
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
                    className="mt-1"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900">{item.focus}</p>
                    <p className="text-sm text-zinc-600">
                      Week of {item.weekOf} • Owner: {item.owner}
                    </p>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
