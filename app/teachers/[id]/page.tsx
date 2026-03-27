"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useDashboard } from "@/components/dashboard-provider";
import { partitionDancesBySource } from "@/lib/dance-utils";

export default function TeacherProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { students, dances, teachers, ready } = useDashboard();

  const teacher = teachers.find((item) => item.id === id);
  if (!teacher) {
    notFound();
  }

  if (!ready) {
    return (
      <AppShell title={teacher.fullName} subtitle="Teacher profile">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }

  const ledDances = dances.filter((dance) => dance.leadTeacherId === teacher.id);
  const { troupe: ledTroupe, guest: ledGuest } = partitionDancesBySource(ledDances);

  function DanceLedItem({ dance }: { dance: (typeof ledDances)[number] }) {
    const participants = students.filter((student) => dance.studentIds.includes(student.id));
    const isGuest = (dance.source ?? "troupe") === "guest_collaboration";
    return (
      <li
        className={`rounded-lg border px-3 py-2 ${
          isGuest ? "border-amber-100 bg-amber-50/50" : "border-zinc-100 bg-zinc-50"
        }`}
      >
        <Link href={`/dances/${dance.id}`} className="font-medium hover:text-amber-800 hover:underline">
          {dance.name}
        </Link>
        <p className="text-zinc-600">
          Students:{" "}
          {participants.map((student, index) => (
            <span key={student.id} className="inline-flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-900">
                {student.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <Link href={`/students/${student.id}`} className="hover:text-amber-800 hover:underline">
                {student.fullName}
              </Link>
              {index < participants.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </li>
    );
  }

  return (
    <AppShell title={teacher.fullName} subtitle="Teacher profile">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-900">
            {teacher.fullName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-zinc-900">{teacher.fullName}</p>
          </div>
          <span className="sr-only">{teacher.profileImagePlaceholder}</span>
        </div>
        <h2 className="text-lg font-semibold text-zinc-900">Specialty</h2>
        <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-800">{teacher.specialty}</p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Dances led</h2>
        {ledDances.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No dances assigned.</p>
        ) : (
          <div className="mt-3 grid gap-5 text-sm">
            {ledTroupe.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">OK troupe repertoire</h3>
                <ul className="mt-2 space-y-2">
                  {ledTroupe.map((dance) => (
                    <DanceLedItem key={dance.id} dance={dance} />
                  ))}
                </ul>
              </div>
            ) : null}
            {ledGuest.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Guest / collaborative organizations
                </h3>
                <ul className="mt-2 space-y-2">
                  {ledGuest.map((dance) => (
                    <DanceLedItem key={dance.id} dance={dance} />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AppShell>
  );
}
