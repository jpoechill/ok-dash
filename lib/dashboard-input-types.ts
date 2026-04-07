import type { GrantItem } from "@/lib/admin-mock-data";
import type { Dance, Student } from "@/lib/mvp-data";

export type NewStudentInput = {
  fullName: string;
  age: number;
  level: Student["level"];
  shirtSize: Student["shirtSize"];
  phone: string;
  email: string;
  relation: "parent" | "self";
  parentName?: string;
};

export type NewDanceInput = {
  name: string;
  durationMinutes: number;
  leadTeacherId: string;
  studentIds: string[];
  musicFileUrl?: string;
  source?: Dance["source"];
};

export type NewTeacherInput = {
  fullName: string;
  specialty: string;
};

export type NewGrantInput = {
  name: string;
  funder: string;
  status: GrantItem["status"];
  fundingResult: GrantItem["fundingResult"];
  potentialAmount: number;
  dueDate: string;
  focus: string;
  notes: string;
};
