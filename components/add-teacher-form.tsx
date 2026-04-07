"use client";

import { useState, type FormEvent } from "react";
import { useDashboard, type NewTeacherInput } from "@/components/dashboard-provider";

export type AddTeacherFormProps = {
  title?: string;
  openButtonLabel?: string;
};

export function AddTeacherForm({
  title = "Add a teacher",
  openButtonLabel = "Add teacher",
}: AddTeacherFormProps = {}) {
  const { addTeacher } = useDashboard();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !specialty.trim()) return;
    await addTeacher({ fullName, specialty } satisfies NewTeacherInput);
    setFullName("");
    setSpecialty("");
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
        <form onSubmit={handleSubmit} className="mt-4 grid max-w-md gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Full name</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Specialty</span>
            <input
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
              placeholder="e.g. Classical repertoire"
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            >
              Save teacher
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-sm text-zinc-600">
          New teachers are saved in this browser only (same as students and dances).
        </p>
      )}
    </section>
  );
}
