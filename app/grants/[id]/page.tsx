"use client";

import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useGrants } from "@/lib/use-grants";

export default function GrantDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { grants, ready, updateGrant, initialized, loadError } = useGrants();
  const grant = grants.find((item) => item.id === id);

  if (!initialized) {
    return (
      <AppShell title="Grant" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading grant details…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Grant" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }
  if (!ready) {
    return (
      <AppShell title="Grant" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading grant details…</p>
      </AppShell>
    );
  }

  if (!grant) {
    notFound();
  }

  const fundingResultLabel =
    grant.fundingResult === "funded"
      ? "Funded"
      : grant.fundingResult === "not_funded"
        ? "Not funded"
        : "Pending";
  const statusLabel = grant.status === "to_apply" ? "To apply" : "Applied";
  const statusPillClass = grant.status === "to_apply" ? "bg-sky-100 text-sky-800" : "bg-violet-100 text-violet-800";
  const fundingPillClass =
    grant.fundingResult === "funded"
      ? "bg-emerald-100 text-emerald-800"
      : grant.fundingResult === "not_funded"
        ? "bg-rose-100 text-rose-800"
        : "bg-amber-100 text-amber-800";
  const acronym = grant.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("") || "GR";
  const due = new Date(`${grant.dueDate}T00:00:00`);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const oneDayMs = 1000 * 60 * 60 * 24;
  const daysDiff = Math.ceil((due.getTime() - todayMidnight.getTime()) / oneDayMs);
  const daysLeftLabel =
    daysDiff < 0
      ? `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? "" : "s"} overdue`
      : daysDiff === 0
        ? "Due today"
        : `${daysDiff} day${daysDiff === 1 ? "" : "s"} left`;

  return (
    <AppShell title={grant.name} subtitle="Grant detail">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
              {acronym}
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-900">{grant.name}</p>
              <p className="text-sm text-zinc-600">{grant.funder}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusPillClass}`}>
              {statusLabel}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${fundingPillClass}`}>
              {fundingResultLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Funder</dt>
            <dd className="font-medium text-zinc-900">{grant.funder}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Status</dt>
            <dd className="mt-1">
              <select
                value={grant.status}
                onChange={(e) =>
                  updateGrant(grant.id, { status: e.target.value as "to_apply" | "applied" })
                }
                className="w-full max-w-xs rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm font-medium text-zinc-900"
                aria-label="Application status"
              >
                <option value="to_apply">To apply</option>
                <option value="applied">Applied</option>
              </select>
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Max $</dt>
            <dd className="font-medium text-emerald-700">${grant.potentialAmount.toLocaleString()}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Due date</dt>
            <dd className="font-medium text-zinc-900">
              {grant.dueDate} ({daysLeftLabel})
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2 sm:col-span-2">
            <dt className="text-zinc-500">Funding result</dt>
            <dd className="mt-1">
              <select
                value={grant.fundingResult}
                onChange={(e) =>
                  updateGrant(grant.id, {
                    fundingResult: e.target.value as "pending" | "funded" | "not_funded",
                  })
                }
                className="w-full max-w-xs rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm font-medium text-zinc-900"
                aria-label="Funding result"
              >
                <option value="pending">Pending</option>
                <option value="funded">Funded</option>
                <option value="not_funded">Not funded</option>
              </select>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Grant focus</h2>
        <p className="mt-2 text-sm text-zinc-700">{grant.focus}</p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Notes</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{grant.notes}</p>
      </section>
    </AppShell>
  );
}
