"use client";

import { AddStudentForm } from "@/components/add-student-form";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { useDashboard } from "@/components/dashboard-provider";
import { DanceLineupTable } from "@/components/dance-lineup-table";
import { formatStudentLevel } from "@/lib/format-level";
import { partitionDancesBySource } from "@/lib/dance-utils";
import Link from "next/link";

export default function Home() {
  const { students, dances, teachers, currentYearPlan, ready, initialized, loadError } = useDashboard();
  const totalShowMinutes = dances.reduce((total, dance) => total + dance.durationMinutes, 0);
  const { troupe, guest } = partitionDancesBySource(dances);

  if (!initialized) {
    return (
      <AppShell title="Overview" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading dashboard…</p>
      </AppShell>
    );
  }
  if (loadError) {
    return (
      <AppShell title="Overview" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{loadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Overview"
      subtitle="Only what matters this season: dances, students, and teachers."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Dances this year" value={ready ? String(dances.length) : "…"} />
        <StatCard label="Students" value={ready ? String(students.length) : "…"} />
        <StatCard label="Teachers" value={ready ? String(teachers.length) : "…"} />
        <StatCard label="Total show minutes" value={ready ? String(totalShowMinutes) : "…"} />
      </section>

      <section className="grid gap-4">
        <article className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Dance lineup</h2>
          <p className="mt-1 text-sm text-zinc-600">{currentYearPlan.theme}</p>
          {!ready ? (
            <p className="mt-4 text-sm text-zinc-500">Loading…</p>
          ) : (
            <div className="mt-4 grid gap-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-800">OK troupe repertoire</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Core season pieces choreographed and led by the troupe.
                </p>
                <div className="mt-3">
                  <DanceLineupTable dances={troupe} teachers={teachers} variant="home" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-800">Guest / collaborative organizations</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Pieces shared in by partner groups—not the same as core troupe lineup.
                </p>
                <div className="mt-3">
                  <DanceLineupTable dances={guest} teachers={teachers} variant="home" />
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Students in this season</h2>
          <p className="mt-1 text-sm text-zinc-600">{currentYearPlan.notes}</p>
          {!ready ? (
            <p className="mt-4 text-sm text-zinc-500">Loading…</p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {students.map((student) => {
                const enrolledCount = dances.filter((dance) =>
                  dance.studentIds.includes(student.id),
                ).length;
                return (
                  <li
                    key={student.id}
                    className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-zinc-900">
                      <Link
                        href={`/students/${student.id}`}
                        className="hover:text-amber-800 hover:underline"
                      >
                        {student.fullName}
                      </Link>
                    </p>
                    <p className="text-zinc-600">
                      {formatStudentLevel(student.level)} level • {enrolledCount} dance
                      {enrolledCount === 1 ? "" : "s"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </section>

      <section>
        <div>
          <AddStudentForm title="Add a dancer" openButtonLabel="Add dancer" />
        </div>
      </section>
    </AppShell>
  );
}
