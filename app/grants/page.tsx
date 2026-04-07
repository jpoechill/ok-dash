"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import type { GrantItem } from "@/lib/admin-mock-data";
import { useGrants } from "@/lib/use-grants";

type GrantSortColumn = "name" | "funder" | "amount" | "dueDate" | "daysLeft" | "status";

function grantStatusSortLabel(g: GrantItem): string {
  if (g.status === "archived") return "Archived";
  if (g.status === "to_apply") return "To apply";
  if (g.fundingResult === "funded") return "Funded";
  if (g.fundingResult === "not_funded") return "Not funded";
  return "Pending";
}

function defaultSortDir(column: GrantSortColumn): "asc" | "desc" {
  return column === "amount" ? "desc" : "asc";
}

function compareGrantsByColumn(a: GrantItem, b: GrantItem, column: GrantSortColumn, asc: boolean): number {
  const mul = asc ? 1 : -1;
  if (column === "amount") {
    return mul * (a.potentialAmount - b.potentialAmount);
  }
  if (column === "dueDate" || column === "daysLeft") {
    const ta = new Date(`${a.dueDate}T00:00:00`).getTime();
    const tb = new Date(`${b.dueDate}T00:00:00`).getTime();
    return mul * (ta - tb);
  }
  if (column === "name") {
    return mul * a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  }
  if (column === "funder") {
    return mul * a.funder.localeCompare(b.funder, undefined, { sensitivity: "base" });
  }
  if (column === "status") {
    return mul * grantStatusSortLabel(a).localeCompare(grantStatusSortLabel(b), undefined, { sensitivity: "base" });
  }
  return 0;
}

function SortGlyph({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) {
    return (
      <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
        <path d="M6 1l3.5 3.5H2.5L6 1z" />
        <path d="M6 11l-3.5-3.5h7L6 11z" />
      </svg>
    );
  }
  if (asc) {
    return (
      <svg className="h-3.5 w-3.5 shrink-0 text-amber-800" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
        <path d="M6 2l4 6H2l4-6z" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-amber-800" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 10L2 4h8L6 10z" />
    </svg>
  );
}

function GrantColumnSortButton({
  column,
  label,
  align = "left",
  active,
  asc,
  onSort,
}: {
  column: GrantSortColumn;
  label: string;
  align?: "left" | "right";
  active: boolean;
  asc: boolean;
  onSort: (column: GrantSortColumn) => void;
}) {
  const justify = align === "right" ? "justify-end" : "justify-start";
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`${justify} -mx-1 inline-flex min-h-9 w-[calc(100%+0.5rem)] max-w-none items-center gap-1 rounded-md px-1 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 ${align === "right" ? "text-right" : "text-left"}`}
      aria-pressed={active}
      title={`Sort by ${label}`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <SortGlyph active={active} asc={asc} />
    </button>
  );
}

const MOBILE_SORT_CHIPS: { column: GrantSortColumn; label: string }[] = [
  { column: "name", label: "Grant" },
  { column: "funder", label: "Funder" },
  { column: "amount", label: "Max $" },
  { column: "dueDate", label: "Due" },
  { column: "daysLeft", label: "Days" },
  { column: "status", label: "Status" },
];

function GrantMobileSortChips({
  sortColumn,
  sortDir,
  onSort,
}: {
  sortColumn: GrantSortColumn;
  sortDir: "asc" | "desc";
  onSort: (column: GrantSortColumn) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 sm:hidden" role="group" aria-label="Sort grants">
      {MOBILE_SORT_CHIPS.map(({ column, label }) => {
        const active = sortColumn === column;
        const asc = sortDir === "asc";
        return (
          <button
            key={column}
            type="button"
            onClick={() => onSort(column)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${
              active
                ? "border-amber-400 bg-amber-50 text-amber-950"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
            aria-pressed={active}
          >
            {label}
            <SortGlyph active={active} asc={asc} />
          </button>
        );
      })}
    </div>
  );
}

const grantTableColgroup = (
  <colgroup>
    <col style={{ minWidth: "26rem" }} />
    <col style={{ minWidth: "14rem" }} />
    <col style={{ minWidth: "5.25rem" }} />
    <col style={{ minWidth: "7rem" }} />
    <col style={{ minWidth: "9rem" }} />
    <col style={{ minWidth: "6.5rem" }} />
  </colgroup>
);

function GrantTableRow({
  grant,
  grantAcronym,
  formatDaysLeftToApply,
  grantListStatusPill,
}: {
  grant: GrantItem;
  grantAcronym: (name: string) => string;
  formatDaysLeftToApply: (dueDate: string) => string;
  grantListStatusPill: (grant: GrantItem) => { label: string; className: string };
}) {
  const pill = grantListStatusPill(grant);
  return (
    <tr className="border-b border-zinc-100 bg-zinc-50 last:border-b-0">
      <td className="max-w-0 px-4 py-3 pl-5 align-top">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900">
            {grantAcronym(grant.name)}
          </div>
          <Link
            href={`/grants/${grant.id}`}
            title={grant.name}
            className="min-w-0 truncate font-semibold text-zinc-900 hover:text-amber-800 hover:underline"
          >
            {grant.name}
          </Link>
        </div>
      </td>
      <td className="max-w-0 px-3 py-3 align-top text-left text-zinc-800" title={grant.funder}>
        <span className="block truncate">{grant.funder}</span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 align-top text-right font-medium text-zinc-900">
        ${grant.potentialAmount.toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-3 align-top text-zinc-800">{grant.dueDate}</td>
      <td className="whitespace-nowrap px-3 py-3 align-top text-zinc-800">
        {formatDaysLeftToApply(grant.dueDate)}
      </td>
      <td className="whitespace-nowrap px-3 py-3 align-top text-right">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${pill.className}`}>
          {pill.label}
        </span>
      </td>
    </tr>
  );
}

function GrantMobileCard({
  grant,
  grantAcronym,
  formatDaysLeftToApply,
  grantListStatusPill,
}: {
  grant: GrantItem;
  grantAcronym: (name: string) => string;
  formatDaysLeftToApply: (dueDate: string) => string;
  grantListStatusPill: (grant: GrantItem) => { label: string; className: string };
}) {
  const pill = grantListStatusPill(grant);
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
          {grantAcronym(grant.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/grants/${grant.id}`}
              className="min-w-0 text-base font-semibold leading-snug text-zinc-900 underline-offset-2 hover:text-amber-800 hover:underline active:text-amber-900"
            >
              {grant.name}
            </Link>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium leading-none ${pill.className}`}
            >
              {pill.label}
            </span>
          </div>
          <p className="mt-2 break-words text-sm leading-snug text-zinc-600">{grant.funder}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
            <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Max $</dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-zinc-900">
                ${grant.potentialAmount.toLocaleString()}
              </dd>
            </div>
            <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Due</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">{grant.dueDate}</dd>
            </div>
            <div className="col-span-2 min-w-0 rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Days left</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">{formatDaysLeftToApply(grant.dueDate)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
}

function GrantsTableBlock({
  grants,
  grantAcronym,
  formatDaysLeftToApply,
  grantListStatusPill,
  sortColumn,
  sortDir,
  onSort,
}: {
  grants: GrantItem[];
  grantAcronym: (name: string) => string;
  formatDaysLeftToApply: (dueDate: string) => string;
  grantListStatusPill: (grant: GrantItem) => { label: string; className: string };
  sortColumn: GrantSortColumn;
  sortDir: "asc" | "desc";
  onSort: (column: GrantSortColumn) => void;
}) {
  const asc = sortDir === "asc";
  return (
    <>
      <GrantMobileSortChips sortColumn={sortColumn} sortDir={sortDir} onSort={onSort} />
      <div className="mt-3 hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[72rem] border-collapse text-sm">
          {grantTableColgroup}
          <thead>
            <tr className="border-b border-zinc-200 align-bottom text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th scope="col" className="whitespace-nowrap px-4 pb-2 pl-5">
                <GrantColumnSortButton
                  column="name"
                  label="Grant"
                  active={sortColumn === "name"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className="whitespace-nowrap px-3 pb-2">
                <GrantColumnSortButton
                  column="funder"
                  label="Funder"
                  active={sortColumn === "funder"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className="whitespace-nowrap px-3 pb-2 text-right">
                <GrantColumnSortButton
                  column="amount"
                  label="Max $"
                  align="right"
                  active={sortColumn === "amount"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className="whitespace-nowrap px-3 pb-2">
                <GrantColumnSortButton
                  column="dueDate"
                  label="Due date"
                  active={sortColumn === "dueDate"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className="whitespace-nowrap px-3 pb-2">
                <GrantColumnSortButton
                  column="daysLeft"
                  label="Days left"
                  active={sortColumn === "daysLeft"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className="whitespace-nowrap px-3 pb-2 text-right">
                <GrantColumnSortButton
                  column="status"
                  label="Status"
                  align="right"
                  active={sortColumn === "status"}
                  asc={asc}
                  onSort={onSort}
                />
              </th>
            </tr>
          </thead>
        <tbody>
          {grants.map((grant) => (
            <GrantTableRow
              key={grant.id}
              grant={grant}
              grantAcronym={grantAcronym}
              formatDaysLeftToApply={formatDaysLeftToApply}
              grantListStatusPill={grantListStatusPill}
            />
          ))}
        </tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-3 sm:hidden">
        {grants.map((grant) => (
          <GrantMobileCard
            key={grant.id}
            grant={grant}
            grantAcronym={grantAcronym}
            formatDaysLeftToApply={formatDaysLeftToApply}
            grantListStatusPill={grantListStatusPill}
          />
        ))}
      </ul>
    </>
  );
}

export default function GrantsPage() {
  const { grants, addGrant, ready, initialized, loadError } = useGrants();
  const [sortColumn, setSortColumn] = useState<GrantSortColumn>("amount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleGrantSort(column: GrantSortColumn) {
    if (sortColumn === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDir(defaultSortDir(column));
    }
  }
  const [addGrantOpen, setAddGrantOpen] = useState(false);
  const [name, setName] = useState("");
  const [funder, setFunder] = useState("");
  const [potentialAmount, setPotentialAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [focus, setFocus] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"to_apply" | "applied" | "archived">("to_apply");
  const [fundingResult, setFundingResult] = useState<"pending" | "funded" | "not_funded">("pending");

  const grantsToApply = useMemo(
    () =>
      [...grants.filter((grant) => grant.status === "to_apply")].sort((a, b) =>
        compareGrantsByColumn(a, b, sortColumn, sortDir === "asc"),
      ),
    [grants, sortColumn, sortDir],
  );
  const grantsApplied = useMemo(
    () =>
      [...grants.filter((grant) => grant.status === "applied")].sort((a, b) =>
        compareGrantsByColumn(a, b, sortColumn, sortDir === "asc"),
      ),
    [grants, sortColumn, sortDir],
  );
  const grantsArchived = useMemo(
    () =>
      [...grants.filter((grant) => grant.status === "archived")].sort((a, b) =>
        compareGrantsByColumn(a, b, sortColumn, sortDir === "asc"),
      ),
    [grants, sortColumn, sortDir],
  );
  const activeGrants = useMemo(
    () => grants.filter((g) => g.status !== "archived"),
    [grants],
  );
  const totalPotential = activeGrants.reduce((sum, grant) => sum + grant.potentialAmount, 0);
  const fundedCount = activeGrants.filter((grant) => grant.fundingResult === "funded").length;

  function formatFundingResult(result: "pending" | "funded" | "not_funded") {
    if (result === "funded") return "Funded";
    if (result === "not_funded") return "Not funded";
    return "Pending";
  }

  function fundingResultPillClass(result: "pending" | "funded" | "not_funded") {
    if (result === "funded") return "bg-emerald-100 text-emerald-800";
    if (result === "not_funded") return "bg-rose-100 text-rose-800";
    return "bg-amber-100 text-amber-800";
  }

  function statusPillClass(status: "to_apply" | "applied" | "archived") {
    if (status === "to_apply") return "bg-sky-100 text-sky-800";
    if (status === "applied") return "bg-violet-100 text-violet-800";
    return "bg-zinc-100 text-zinc-700";
  }

  function grantListStatusPill(grant: GrantItem) {
    if (grant.status === "archived") {
      return { label: "Archived", className: statusPillClass("archived") };
    }
    if (grant.status === "to_apply") {
      return { label: "To apply", className: statusPillClass("to_apply") };
    }
    return {
      label: formatFundingResult(grant.fundingResult),
      className: fundingResultPillClass(grant.fundingResult),
    };
  }

  function grantAcronym(name: string) {
    const letters = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("");
    return letters || "GR";
  }

  function formatDaysLeftToApply(dueDate: string) {
    const due = new Date(`${dueDate}T00:00:00`);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const oneDayMs = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil((due.getTime() - todayMidnight.getTime()) / oneDayMs);

    if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} overdue`;
    if (diffDays === 0) return "Due today";
    return `${diffDays} day${diffDays === 1 ? "" : "s"} left`;
  }

  async function handleAddGrant(e: FormEvent) {
    e.preventDefault();
    const amount = Number(potentialAmount);
    if (!name.trim() || !funder.trim() || !dueDate || !focus.trim() || !Number.isFinite(amount) || amount < 0) {
      return;
    }
    await addGrant({
      name,
      funder,
      status,
      fundingResult,
      potentialAmount: amount,
      dueDate,
      focus,
      notes,
    });
    setName("");
    setFunder("");
    setPotentialAmount("");
    setDueDate("");
    setFocus("");
    setNotes("");
    setStatus("to_apply");
    setFundingResult("pending");
  }

  if (!initialized) {
    return (
      <AppShell title="Grants" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Grants" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Grants"
      subtitle="Pipeline of grant opportunities, applications in progress, and potential funding."
    >
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <article className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <p className="text-sm text-zinc-500">To apply</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{ready ? grantsToApply.length : "..."}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <p className="text-sm text-zinc-500">Applied</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{ready ? grantsApplied.length : "..."}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <p className="text-sm text-zinc-500">Archived</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-700">{ready ? grantsArchived.length : "..."}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <p className="text-sm text-zinc-500">Total potential</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">${totalPotential.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <p className="text-sm text-zinc-500">Successfully funded</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{fundedCount}</p>
        </article>
      </section>

      <section className="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">Add grant</h2>
          <button
            type="button"
            onClick={() => setAddGrantOpen((prev) => !prev)}
            className="min-h-11 w-full rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-base text-zinc-700 hover:border-amber-300 sm:min-h-0 sm:w-auto sm:px-3 sm:py-1 sm:text-sm"
          >
            {addGrantOpen ? "Minimize" : "Add grant"}
          </button>
        </div>
        {addGrantOpen ? (
          <form onSubmit={handleAddGrant} className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-zinc-600">Grant name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
                autoComplete="off"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Funder</span>
              <input
                required
                value={funder}
                onChange={(e) => setFunder(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
                autoComplete="off"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Max $</span>
              <input
                required
                type="number"
                min={0}
                value={potentialAmount}
                onChange={(e) => setPotentialAmount(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Due date</span>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-zinc-600">Focus</span>
              <input
                required
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              />
            </label>
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-zinc-600">Notes</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "to_apply" | "applied" | "archived")}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              >
                <option value="to_apply">To apply</option>
                <option value="applied">Applied</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Funding result</span>
              <select
                value={fundingResult}
                onChange={(e) => setFundingResult(e.target.value as "pending" | "funded" | "not_funded")}
                className="min-h-11 rounded-lg border border-zinc-200 px-3 py-2 text-base sm:min-h-0 sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="funded">Funded</option>
                <option value="not_funded">Not funded</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="min-h-11 w-full rounded-full bg-amber-800 px-4 py-2.5 text-base font-medium text-white hover:bg-amber-900 sm:min-h-0 sm:w-auto sm:py-2 sm:text-sm"
              >
                Save grant
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">Use this card to add a new grant opportunity.</p>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Grants to apply for</h2>
        <GrantsTableBlock
          grants={grantsToApply}
          grantAcronym={grantAcronym}
          formatDaysLeftToApply={formatDaysLeftToApply}
          grantListStatusPill={grantListStatusPill}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleGrantSort}
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Grants applied to</h2>
        <GrantsTableBlock
          grants={grantsApplied}
          grantAcronym={grantAcronym}
          formatDaysLeftToApply={formatDaysLeftToApply}
          grantListStatusPill={grantListStatusPill}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleGrantSort}
        />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Archived grants</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Closed, withdrawn, or no longer pursued—kept for reference and out of active pipeline totals.
        </p>
        <div className="mt-4">
          <GrantsTableBlock
            grants={grantsArchived}
            grantAcronym={grantAcronym}
            formatDaysLeftToApply={formatDaysLeftToApply}
            grantListStatusPill={grantListStatusPill}
            sortColumn={sortColumn}
            sortDir={sortDir}
            onSort={handleGrantSort}
          />
        </div>
      </section>
    </AppShell>
  );
}
