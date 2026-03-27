"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useDashboard } from "@/components/dashboard-provider";
import { displayDanceTitle } from "@/lib/dance-utils";
import { formatStudentLevel } from "@/lib/format-level";

export default function DanceProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { students, dances, teachers, ready } = useDashboard();

  const shellTitle = "Dances";
  const shellSubtitle = "Dance catalog with music files. Additions are saved in this browser.";

  if (!ready) {
    return (
      <AppShell title={shellTitle} subtitle={shellSubtitle}>
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }

  const dance = dances.find((item) => item.id === id);
  if (!dance) {
    notFound();
  }

  const leadTeacher = teachers.find((teacher) => teacher.id === dance.leadTeacherId);
  const participants = students.filter((student) => dance.studentIds.includes(student.id));
  const source = dance.source ?? "troupe";
  const isGuest = source === "guest_collaboration";
  const pieceTitle = displayDanceTitle(dance);
  const pieceSummary = `${dance.durationMinutes} min · ${
    isGuest ? "Guest performance (collaborative organization)" : "OK troupe repertoire"
  }`;
  const showFullProgramName = pieceTitle !== dance.name.trim();

  return (
    <AppShell title={shellTitle} subtitle={shellSubtitle}>
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{pieceTitle}</h2>
        <p className="mt-1 text-sm text-zinc-600">{pieceSummary}</p>
        {isGuest ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Guest / collaborative organization piece—repertoire shared in by a partner group, not core troupe
            choreography.
          </p>
        ) : null}
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {showFullProgramName ? (
            <div className="rounded-lg bg-zinc-50 px-3 py-2 sm:col-span-2">
              <dt className="text-zinc-500">Full program name</dt>
              <dd className="text-zinc-800">{dance.name}</dd>
            </div>
          ) : null}
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Lineup</dt>
            <dd className="font-medium text-zinc-900">
              {isGuest ? "Guest / collaborative org" : "OK troupe repertoire"}
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2">
            <dt className="text-zinc-500">Duration</dt>
            <dd className="font-medium text-zinc-900">{dance.durationMinutes} min</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2 sm:col-span-2">
            <dt className="text-zinc-500">Lead teacher</dt>
            <dd className="font-medium text-zinc-900">
              {leadTeacher ? (
                <Link href={`/teachers/${leadTeacher.id}`} className="hover:text-amber-800 hover:underline">
                  {leadTeacher.fullName}
                </Link>
              ) : (
                "Unassigned"
              )}
            </dd>
          </div>
        </dl>
        <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3">
          <p className="text-sm font-medium text-zinc-800">Music</p>
          <audio controls className="mt-2 h-9 w-full max-w-md" src={dance.musicFileUrl}>
            Your browser does not support audio playback.
          </audio>
          <p className="mt-2 text-sm">
            <a
              href={dance.musicFileUrl}
              download
              className="font-medium text-amber-900 hover:text-amber-700 hover:underline"
            >
              Download {dance.musicFileUrl.split("/").pop()}
            </a>
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Participating students</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {participants.map((student) => (
            <li key={student.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900">
                  {student.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <Link href={`/students/${student.id}`} className="font-medium hover:text-amber-800 hover:underline">
                  {student.fullName}
                </Link>
                <span className="sr-only">{student.profileImagePlaceholder}</span>
              </div>
              <p className="text-zinc-600">
                {formatStudentLevel(student.level)} level • size {student.shirtSize}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
