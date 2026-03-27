"use client";

import Link from "next/link";
import type { Dance, Teacher } from "@/lib/mvp-data";

type Variant = "home" | "catalog";

export function DanceLineupTable({
  dances,
  teachers,
  variant,
}: {
  dances: Dance[];
  teachers: Teacher[];
  variant: Variant;
}) {
  if (dances.length === 0) {
    return <p className="text-sm text-zinc-500">No dances in this group.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-zinc-500">
          <tr>
            <th className="py-2">Dance</th>
            {variant === "catalog" ? <th className="py-2">Duration</th> : null}
            <th className="py-2">Lead teacher</th>
            <th className="py-2">Students</th>
            <th className="py-2">Music</th>
          </tr>
        </thead>
        <tbody>
          {dances.map((dance) => {
            const teacher = teachers.find((item) => item.id === dance.leadTeacherId);
            return (
              <tr key={dance.id} className="border-t border-zinc-100">
                <td className="py-2">
                  <Link
                    href={`/dances/${dance.id}`}
                    className="font-medium text-zinc-900 hover:text-amber-800 hover:underline"
                  >
                    {dance.name}
                  </Link>
                </td>
                {variant === "catalog" ? (
                  <td className="py-2">{dance.durationMinutes} min</td>
                ) : null}
                <td className="py-2">
                  {teacher ? (
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="hover:text-amber-800 hover:underline"
                    >
                      {teacher.fullName}
                    </Link>
                  ) : (
                    "Unassigned"
                  )}
                </td>
                <td className="py-2">{dance.studentIds.length}</td>
                <td className="py-2">
                  <a
                    href={dance.musicFileUrl}
                    download
                    className="font-medium text-amber-900 hover:text-amber-700 hover:underline"
                  >
                    {dance.musicFileUrl.split("/").pop()}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
