"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useDashboard, type NewDanceInput } from "@/components/dashboard-provider";

export type AddDanceFormProps = {
  title?: string;
  openButtonLabel?: string;
};

export function AddDanceForm({
  title = "Add a dance",
  openButtonLabel = "Add dance",
}: AddDanceFormProps = {}) {
  const { students, teachers, addDance } = useDashboard();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("5");
  const [leadTeacherId, setLeadTeacherId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [musicFileUrl, setMusicFileUrl] = useState("/music/placeholder.mp3");
  const [guestCollaboration, setGuestCollaboration] = useState(false);

  useEffect(() => {
    if (!open || !teachers.length) return;
    setLeadTeacherId((prev) =>
      prev && teachers.some((t) => t.id === prev) ? prev : teachers[0].id,
    );
  }, [open, teachers]);

  function toggleStudent(id: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !leadTeacherId) return;
    const mins = Number(durationMinutes);
    if (!Number.isFinite(mins) || mins < 1) return;
    addDance({
      name,
      durationMinutes: mins,
      leadTeacherId,
      studentIds: selectedStudentIds,
      musicFileUrl: musicFileUrl.trim() || "/music/placeholder.mp3",
      source: guestCollaboration ? "guest_collaboration" : "troupe",
    } satisfies NewDanceInput);
    setName("");
    setDurationMinutes("5");
    setLeadTeacherId(teachers[0]?.id ?? "");
    setSelectedStudentIds([]);
    setMusicFileUrl("/music/placeholder.mp3");
    setGuestCollaboration(false);
    setOpen(false);
  }

  return (
    <section className="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-amber-300"
        >
          {open ? "Cancel" : openButtonLabel}
        </button>
      </div>
      {open ? (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm sm:max-w-md">
            <span className="text-zinc-600">Dance name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 sm:max-w-2xl">
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600">Duration (minutes)</span>
              <input
                required
                type="number"
                min={1}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-600">Lead teacher</span>
              <select
                value={leadTeacherId}
                onChange={(e) => setLeadTeacherId(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={guestCollaboration}
              onChange={(e) => setGuestCollaboration(e.target.checked)}
            />
            <span className="text-zinc-700">
              Guest / collaborative organization piece (not core troupe repertoire)
            </span>
          </label>
          <label className="grid gap-1 text-sm sm:max-w-md">
            <span className="text-zinc-600">Music file URL (.mp3 in /public/music)</span>
            <input
              value={musicFileUrl}
              onChange={(e) => setMusicFileUrl(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs"
              placeholder="/music/placeholder.mp3"
            />
          </label>
          <fieldset>
            <legend className="text-sm text-zinc-600">Students in this dance (optional)</legend>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {students.map((s) => (
                <li key={s.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                    />
                    {s.fullName}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <div>
            <button
              type="submit"
              className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            >
              Save dance
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-sm text-zinc-600">
          New dances are saved in this browser only. Drop a real .mp3 in{" "}
          <code className="rounded bg-zinc-100 px-1">public/music</code> and point the URL at it.
        </p>
      )}
    </section>
  );
}
