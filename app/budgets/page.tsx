"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useDashboard } from "@/components/dashboard-provider";

export default function BudgetsPage() {
  const { budgetCategories, initialized, loadError } = useDashboard();
  const [bufferPercent, setBufferPercent] = useState(10);

  const totals = useMemo(() => {
    const planned = budgetCategories.reduce((sum, item) => sum + item.planned, 0);
    const spent = budgetCategories.reduce((sum, item) => sum + item.spent, 0);
    const forecast = Math.round(planned * (1 + bufferPercent / 100));
    return { planned, spent, forecast };
  }, [bufferPercent, budgetCategories]);

  if (!initialized) {
    return (
      <AppShell title="Budgets" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Budgets" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Budgets"
      subtitle="Compare planned versus spent amounts and explore forecast scenarios."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Planned total</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">${totals.planned.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Spent to date</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">${totals.spent.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Forecast (+{bufferPercent}%)</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">${totals.forecast.toLocaleString()}</p>
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">Category budget tracker</h2>
          <label className="text-sm text-zinc-600">
            Forecast buffer: <span className="font-medium text-zinc-900">{bufferPercent}%</span>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={bufferPercent}
              onChange={(e) => setBufferPercent(Number(e.target.value))}
              className="ml-3 align-middle"
            />
          </label>
        </div>

        <ul className="mt-4 space-y-3">
          {budgetCategories.map((category) => {
            const percent = Math.min(100, Math.round((category.spent / category.planned) * 100));
            return (
              <li key={category.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  <p className="text-sm text-zinc-600">
                    ${category.spent.toLocaleString()} / ${category.planned.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full rounded-full bg-amber-600" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{percent}% used</p>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
