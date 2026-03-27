import type { Student } from "@/lib/mvp-data";

export function formatStudentLevel(level: Student["level"]): string {
  return level
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
