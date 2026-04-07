"use client";

import { useState, type FormEvent } from "react";
import { useDashboard, type NewStudentInput } from "@/components/dashboard-provider";
import { formatStudentLevel } from "@/lib/format-level";

const levels: NewStudentInput["level"][] = ["youth", "young adult", "adult"];
const sizes: NewStudentInput["shirtSize"][] = ["XS", "S", "M", "L", "XL"];

export type AddStudentFormProps = {
  /** Card heading (default: Add a student) */
  title?: string;
  /** Closed-state toggle label (default: Add student) */
  openButtonLabel?: string;
  /** Dense header and padding; omits long closed-state help text. */
  compact?: boolean;
};

export function AddStudentForm({
  title = "Add a student",
  openButtonLabel = "Add student",
  compact = false,
}: AddStudentFormProps = {}) {
  const { addStudent } = useDashboard();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState<NewStudentInput["level"]>("youth");
  const [shirtSize, setShirtSize] = useState<NewStudentInput["shirtSize"]>("M");
  const [phone, setPhone] = useState("510-555-0000");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<"self" | "parent">("self");
  const [parentName, setParentName] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ageNum = Number(age);
    if (!fullName.trim() || !Number.isFinite(ageNum) || ageNum < 1) return;
    if (relation === "parent" && !parentName.trim()) return;
    await addStudent({
      fullName,
      age: ageNum,
      level,
      shirtSize,
      phone,
      email,
      relation,
      parentName: relation === "parent" ? parentName : undefined,
    });
    setFullName("");
    setAge("");
    setLevel("youth");
    setShirtSize("M");
    setPhone("510-555-0000");
    setEmail("");
    setRelation("self");
    setParentName("");
    setOpen(false);
  }

  return (
    <section
      className={
        compact
          ? "rounded-lg border border-zinc-200 bg-white px-3 py-2.5"
          : "rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-5"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={compact ? "text-sm font-medium text-zinc-800" : "text-lg font-semibold text-zinc-900"}>
          {title}
        </h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={
            compact
              ? "rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-amber-300"
              : "rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-amber-300"
          }
        >
          {open ? "Cancel" : openButtonLabel}
        </button>
      </div>
      {open ? (
        <form
          onSubmit={handleSubmit}
          className={compact ? "mt-3 grid gap-2.5 sm:grid-cols-2" : "mt-4 grid gap-3 sm:grid-cols-2"}
        >
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
            <span className="text-zinc-600">Age</span>
            <input
              required
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Level</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as NewStudentInput["level"])}
              className="rounded-lg border border-zinc-200 px-3 py-2"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {formatStudentLevel(l)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Size</span>
            <select
              value={shirtSize}
              onChange={(e) => setShirtSize(e.target.value as NewStudentInput["shirtSize"])}
              className="rounded-lg border border-zinc-200 px-3 py-2"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Phone</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
              placeholder="510-555-5555"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-600">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2"
              placeholder="contact@email.com"
            />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm text-zinc-600">Relation</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="relation"
                  checked={relation === "self"}
                  onChange={() => setRelation("self")}
                />
                Self
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="relation"
                  checked={relation === "parent"}
                  onChange={() => setRelation("parent")}
                />
                Parent
              </label>
            </div>
          </fieldset>
          {relation === "parent" ? (
            <label className="grid gap-1 text-sm sm:col-span-2">
              <span className="text-zinc-600">Parent / guardian name</span>
              <input
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              />
            </label>
          ) : null}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900"
            >
              Save student
            </button>
          </div>
        </form>
      ) : compact ? null : (
        <p className="mt-2 text-sm text-zinc-600">
          New students are saved in this browser only (for a simple internal MVP).
        </p>
      )}
    </section>
  );
}
