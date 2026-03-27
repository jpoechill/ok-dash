"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useDashboard, type NewStudentInput } from "@/components/dashboard-provider";
import { partitionDancesBySource } from "@/lib/dance-utils";
import { formatStudentLevel } from "@/lib/format-level";

const levels: NewStudentInput["level"][] = ["youth", "young adult", "adult"];
const sizes: NewStudentInput["shirtSize"][] = ["XS", "S", "M", "L", "XL"];

export default function StudentProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { students, dances, teachers, updateStudent, ready } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState<NewStudentInput["level"]>("youth");
  const [shirtSize, setShirtSize] = useState<NewStudentInput["shirtSize"]>("M");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<"self" | "parent">("self");
  const [parentName, setParentName] = useState("");

  if (!ready) {
    return (
      <AppShell title="Student" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading profile…</p>
      </AppShell>
    );
  }

  const student = students.find((item) => item.id === id);
  useEffect(() => {
    if (!student) return;
    setFullName(student.fullName);
    setAge(String(student.age));
    setLevel(student.level);
    setShirtSize(student.shirtSize);
    setPhone(student.phone);
    setEmail(student.email);
    setRelation(student.relation);
    setParentName(student.parentName ?? "");
  }, [student]);

  if (!student) {
    notFound();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!student) return;
    const ageNum = Number(age);
    if (!fullName.trim() || !Number.isFinite(ageNum) || ageNum < 1) return;
    if (relation === "parent" && !parentName.trim()) return;
    updateStudent(student.id, {
      fullName,
      age: ageNum,
      level,
      shirtSize,
      phone,
      email,
      relation,
      parentName: relation === "parent" ? parentName : undefined,
    });
    setEditing(false);
  }

  const assignedDances = dances.filter((dance) => dance.studentIds.includes(student.id));
  const { troupe: troupeAssigned, guest: guestAssigned } = partitionDancesBySource(assignedDances);

  return (
    <AppShell title={student.fullName} subtitle="Student profile">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-900">
            {student.fullName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-zinc-900">{student.fullName}</p>
          </div>
          <span className="sr-only">{student.profileImagePlaceholder}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">Details</h2>
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 hover:border-amber-300"
          >
            {editing ? "Cancel" : "Edit details"}
          </button>
        </div>
        {editing ? (
          <form onSubmit={handleSubmit} className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-zinc-600">Full name</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1">
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
            <label className="grid gap-1">
              <span className="text-zinc-600">Level</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as NewStudentInput["level"])}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              >
                {levels.map((entry) => (
                  <option key={entry} value={entry}>
                    {formatStudentLevel(entry)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Size</span>
              <select
                value={shirtSize}
                onChange={(e) => setShirtSize(e.target.value as NewStudentInput["shirtSize"])}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              >
                {sizes.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Phone</span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-zinc-600">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-zinc-200 px-3 py-2"
              />
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="text-sm text-zinc-600">Contact Relation</legend>
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
              <label className="grid gap-1 sm:col-span-2">
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
                Save details
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Age</dt>
              <dd className="font-medium text-zinc-900">{student.age}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Level</dt>
              <dd className="font-medium text-zinc-900">{formatStudentLevel(student.level)}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Size</dt>
              <dd className="font-medium text-zinc-900">{student.shirtSize}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Phone</dt>
              <dd className="font-medium text-zinc-900">{student.phone}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Email</dt>
              <dd className="font-medium text-zinc-900">
                {student.email ? (
                  <a href={`mailto:${student.email}`} className="text-amber-900 hover:underline">
                    {student.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="rounded-lg bg-zinc-50 px-3 py-2">
              <dt className="text-zinc-500">Contact Relation</dt>
              <dd className="font-medium capitalize text-zinc-900">{student.relation}</dd>
            </div>
            {student.relation === "parent" && student.parentName ? (
              <div className="rounded-lg bg-zinc-50 px-3 py-2 sm:col-span-2">
                <dt className="text-zinc-500">Parent / guardian</dt>
                <dd className="font-medium text-zinc-900">{student.parentName}</dd>
              </div>
            ) : null}
          </dl>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Assigned dances</h2>
        {assignedDances.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No dances yet.</p>
        ) : (
          <div className="mt-3 grid gap-5 text-sm">
            {troupeAssigned.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">OK troupe repertoire</h3>
              <ul className="mt-2 space-y-2">
                {troupeAssigned.map((dance) => {
                  const leadTeacher = teachers.find((teacher) => teacher.id === dance.leadTeacherId);
                  return (
                    <li key={dance.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                      <Link href={`/dances/${dance.id}`} className="font-medium hover:text-amber-800 hover:underline">
                        {dance.name}
                      </Link>
                      <p className="text-zinc-600">
                        Lead teacher:{" "}
                        {leadTeacher ? (
                          <Link href={`/teachers/${leadTeacher.id}`} className="hover:text-amber-800 hover:underline">
                            {leadTeacher.fullName}
                          </Link>
                        ) : (
                          "Unassigned"
                        )}
                      </p>
                      <p className="mt-1 text-sm">
                        <a
                          href={dance.musicFileUrl}
                          download
                          className="font-medium text-amber-900 hover:text-amber-700 hover:underline"
                        >
                          Download {dance.musicFileUrl.split("/").pop()}
                        </a>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
            ) : null}
            {guestAssigned.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Guest / collaborative organizations
                </h3>
                <ul className="mt-2 space-y-2">
                  {guestAssigned.map((dance) => {
                    const leadTeacher = teachers.find((teacher) => teacher.id === dance.leadTeacherId);
                    return (
                      <li key={dance.id} className="rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2">
                        <Link href={`/dances/${dance.id}`} className="font-medium hover:text-amber-800 hover:underline">
                          {dance.name}
                        </Link>
                        <p className="text-zinc-600">
                          Lead teacher:{" "}
                          {leadTeacher ? (
                            <Link href={`/teachers/${leadTeacher.id}`} className="hover:text-amber-800 hover:underline">
                              {leadTeacher.fullName}
                            </Link>
                          ) : (
                            "Unassigned"
                          )}
                        </p>
                        <p className="mt-1 text-sm">
                          <a
                            href={dance.musicFileUrl}
                            download
                            className="font-medium text-amber-900 hover:text-amber-700 hover:underline"
                          >
                            Download {dance.musicFileUrl.split("/").pop()}
                          </a>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AppShell>
  );
}
