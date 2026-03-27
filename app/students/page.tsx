"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AddStudentForm } from "@/components/add-student-form";
import { useDashboard } from "@/components/dashboard-provider";
import { partitionDancesBySource } from "@/lib/dance-utils";
import { formatStudentLevel } from "@/lib/format-level";
import type { Student } from "@/lib/mvp-data";
import Link from "next/link";

type SortKey = "student" | "age" | "level" | "size" | "phone" | "email" | "relation" | "dances";
type SortDirection = "asc" | "desc";

export default function StudentsPage() {
  const { students, dances, ready } = useDashboard();
  const [sortKey, setSortKey] = useState<SortKey>("student");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDanceId, setFilterDanceId] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<"all" | Student["level"]>("all");
  const [relationFilter, setRelationFilter] = useState<"all" | Student["relation"]>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const rosterRows = useMemo(
    () =>
      students.map((student) => ({
        student,
        assignedDances: dances.filter((dance) => dance.studentIds.includes(student.id)),
      })),
    [students, dances],
  );

  const { troupe: troupeDances, guest: guestDances } = useMemo(
    () => partitionDancesBySource(dances),
    [dances],
  );

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rosterRows.filter(({ student, assignedDances }) => {
      if (q) {
        const blob = [student.fullName, student.email, student.phone, student.parentName ?? ""]
          .join(" ")
          .toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (filterDanceId !== "") {
        const inSelected = assignedDances.some((d) => d.id === filterDanceId);
        if (!inSelected) return false;
      }
      if (levelFilter !== "all" && student.level !== levelFilter) return false;
      if (relationFilter !== "all" && student.relation !== relationFilter) return false;
      return true;
    });
  }, [rosterRows, searchQuery, filterDanceId, levelFilter, relationFilter]);

  const sortedRows = useMemo(() => {
    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    const direction = sortDirection === "asc" ? 1 : -1;
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      switch (sortKey) {
        case "student":
          return direction * collator.compare(a.student.fullName, b.student.fullName);
        case "age":
          return direction * (a.student.age - b.student.age);
        case "level":
          return direction * collator.compare(a.student.level, b.student.level);
        case "size":
          return direction * collator.compare(a.student.shirtSize, b.student.shirtSize);
        case "phone":
          return direction * collator.compare(a.student.phone, b.student.phone);
        case "email":
          return direction * collator.compare(a.student.email, b.student.email);
        case "relation":
          return direction * collator.compare(a.student.relation, b.student.relation);
        case "dances":
          return direction * collator.compare(
            a.assignedDances.map((dance) => dance.name).join(", "),
            b.assignedDances.map((dance) => dance.name).join(", "),
          );
        default:
          return 0;
      }
    });
    return rows;
  }, [filteredRows, sortDirection, sortKey]);

  function handleSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return " ";
    return sortDirection === "asc" ? "↑" : "↓";
  }

  function clearFilters() {
    setSearchQuery("");
    setFilterDanceId("");
    setLevelFilter("all");
    setRelationFilter("all");
  }

  const hasActiveFilters =
    searchQuery.trim() !== "" || filterDanceId !== "" || levelFilter !== "all" || relationFilter !== "all";

  return (
    <AppShell
      title="Students"
      subtitle="Students participating in this year's dances. Additions are saved in this browser."
    >
      <div className="grid gap-2">
        <AddStudentForm compact title="Add student" />

        <section className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex w-full min-w-0 items-center justify-between gap-2 text-left"
            aria-expanded={filtersOpen}
          >
            <span className="text-sm font-medium text-zinc-800">Filters</span>
            <span className="flex shrink-0 items-center gap-2">
              {hasActiveFilters ? (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-900">
                  Active
                </span>
              ) : null}
              <span className="text-zinc-400" aria-hidden>
                {filtersOpen ? "▾" : "▸"}
              </span>
            </span>
          </button>

          {filtersOpen ? (
            <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, phone…"
                  className="min-w-[12rem] flex-1 rounded-md border border-zinc-200 px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  autoComplete="off"
                />
                <select
                    value={filterDanceId}
                    onChange={(e) => setFilterDanceId(e.target.value)}
                    aria-label="Dance"
                    className="min-w-[10rem] max-w-full flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300 sm:max-w-xs"
                  >
                    <option value="">Any dance</option>
                    <optgroup label="OK troupe">
                      {troupeDances.map((dance) => (
                        <option key={dance.id} value={dance.id}>
                          {dance.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Guest / collaborative">
                      {guestDances.map((dance) => (
                        <option key={dance.id} value={dance.id}>
                          {dance.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  aria-label="Level"
                >
                  <option value="all">All levels</option>
                  <option value="youth">Youth</option>
                  <option value="young adult">Young adult</option>
                  <option value="adult">Adult</option>
                </select>
                <select
                  value={relationFilter}
                  onChange={(e) => setRelationFilter(e.target.value as typeof relationFilter)}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  aria-label="Contact relation"
                >
                  <option value="all">All contacts</option>
                  <option value="self">Self</option>
                  <option value="parent">Parent</option>
                </select>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="shrink-0 rounded-md border border-zinc-200 px-2 py-1.5 text-xs font-medium text-zinc-600 hover:border-amber-300 hover:text-zinc-900"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">Student roster</h2>
          {ready ? (
            <p className="text-sm text-zinc-500">
              Showing{" "}
              <span className="font-medium text-zinc-700">{sortedRows.length}</span> of{" "}
              <span className="font-medium text-zinc-700">{rosterRows.length}</span> students
              {hasActiveFilters ? " (filtered)" : ""}
            </p>
          ) : null}
        </div>
        {!ready ? (
          <p className="mt-4 text-sm text-zinc-500">Loading roster…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("student")}>
                      Student {sortIndicator("student")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("age")}>
                      Age {sortIndicator("age")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("level")}>
                      Level {sortIndicator("level")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("size")}>
                      Size {sortIndicator("size")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("phone")}>
                      Phone {sortIndicator("phone")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("email")}>
                      Email {sortIndicator("email")}
                    </button>
                  </th>
                  <th className="py-2 pr-8">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("relation")}>
                      Relation {sortIndicator("relation")}
                    </button>
                  </th>
                  <th className="py-2">
                    <button type="button" className="hover:text-zinc-700" onClick={() => handleSort("dances")}>
                      Assigned dances {sortIndicator("dances")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-zinc-500">
                      {hasActiveFilters
                        ? "No students match these filters. Try clearing or adjusting them."
                        : "No students in the roster."}
                    </td>
                  </tr>
                ) : null}
                {sortedRows.map(({ student, assignedDances }) => {
                  return (
                    <tr key={student.id} className="border-t border-zinc-100">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900">
                            {student.fullName
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <Link
                            href={`/students/${student.id}`}
                            className="font-medium text-zinc-900 hover:text-amber-800 hover:underline"
                          >
                            {student.fullName}
                          </Link>
                          <span className="sr-only">{student.profileImagePlaceholder}</span>
                        </div>
                      </td>
                      <td className="py-2">{student.age}</td>
                      <td className="py-2">{formatStudentLevel(student.level)}</td>
                      <td className="py-2">{student.shirtSize}</td>
                      <td className="py-2">{student.phone}</td>
                      <td className="py-2">
                        {student.email ? (
                          <a
                            href={`mailto:${student.email}`}
                            className="text-amber-900 hover:underline"
                          >
                            {student.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 pr-8 capitalize">{student.relation}</td>
                      <td className="py-2">
                        {assignedDances.length > 0 ? (
                          assignedDances.map((dance, index) => (
                            <span key={dance.id}>
                              {index > 0 ? ", " : ""}
                              <Link
                                href={`/dances/${dance.id}`}
                                className="text-amber-900 hover:text-amber-700 hover:underline"
                              >
                                {dance.name}
                              </Link>
                            </span>
                          ))
                        ) : (
                          "Not assigned yet"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
