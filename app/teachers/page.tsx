"use client";

import { AppShell } from "@/components/app-shell";
import { AddTeacherForm } from "@/components/add-teacher-form";
import { useDashboard } from "@/components/dashboard-provider";
import Link from "next/link";

export default function TeachersPage() {
  const { dances, teachers, ready } = useDashboard();

  return (
    <AppShell
      title="Teachers"
      subtitle="Teachers leading this year's dances. Additions are saved in this browser."
    >
      <AddTeacherForm />

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Teaching team</h2>
        {!ready ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {teachers.map((teacher) => {
              const ledDances = dances.filter((dance) => dance.leadTeacherId === teacher.id);
              return (
                <li key={teacher.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                  <p className="font-medium text-zinc-900">
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="hover:text-amber-800 hover:underline"
                    >
                      {teacher.fullName}
                    </Link>
                  </p>
                  <p className="text-sm text-zinc-600">{teacher.specialty}</p>
                  <p className="mt-1 text-sm text-zinc-700">
                    Leading: {ledDances.map((dance) => dance.name).join(", ") || "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
