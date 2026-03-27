"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Dance, Student, Teacher } from "@/lib/mvp-data";
import {
  dances as seedDances,
  students as seedStudents,
  teachers as seedTeachers,
} from "@/lib/mvp-data";

const STORAGE_STUDENTS = "dashboard-additional-students";
const STORAGE_DANCES = "dashboard-additional-dances";
const STORAGE_TEACHERS = "dashboard-additional-teachers";
const STORAGE_STUDENT_EDITS = "dashboard-edited-students";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

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
  /** Defaults to troupe repertoire. */
  source?: Dance["source"];
};

export type NewTeacherInput = {
  fullName: string;
  specialty: string;
};

type DashboardContextValue = {
  students: Student[];
  dances: Dance[];
  teachers: Teacher[];
  addStudent: (input: NewStudentInput) => Student;
  updateStudent: (id: string, input: NewStudentInput) => Student | null;
  addDance: (input: NewDanceInput) => Dance;
  addTeacher: (input: NewTeacherInput) => Teacher;
  /** True after browser storage has been merged (avoid hydration mismatch in lists). */
  ready: boolean;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [extraStudents, setExtraStudents] = useState<Student[]>([]);
  const [extraDances, setExtraDances] = useState<Dance[]>([]);
  const [extraTeachers, setExtraTeachers] = useState<Teacher[]>([]);
  const [editedStudentsById, setEditedStudentsById] = useState<Record<string, Student>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setExtraStudents(loadJson(STORAGE_STUDENTS, []));
    setExtraDances(
      loadJson<Array<Dance & { source?: Dance["source"] }>>(STORAGE_DANCES, []).map((dance) => ({
        ...dance,
        source: dance.source ?? "troupe",
      })),
    );
    setExtraTeachers(loadJson(STORAGE_TEACHERS, []));
    setEditedStudentsById(loadJson(STORAGE_STUDENT_EDITS, {}));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(extraStudents));
  }, [extraStudents, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_DANCES, JSON.stringify(extraDances));
  }, [extraDances, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_TEACHERS, JSON.stringify(extraTeachers));
  }, [extraTeachers, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_STUDENT_EDITS, JSON.stringify(editedStudentsById));
  }, [editedStudentsById, ready]);

  const students = useMemo(
    () =>
      [...seedStudents, ...extraStudents].map((student) => editedStudentsById[student.id] ?? student),
    [extraStudents, editedStudentsById],
  );
  const dances = useMemo(() => [...seedDances, ...extraDances], [extraDances]);
  const teachers = useMemo(() => [...seedTeachers, ...extraTeachers], [extraTeachers]);

  const addStudent = useCallback((input: NewStudentInput) => {
    const id = `s-${Date.now()}`;
    const student: Student = {
      id,
      fullName: input.fullName.trim(),
      age: input.age,
      level: input.level,
      shirtSize: input.shirtSize,
      phone: input.phone.trim(),
      email: input.email.trim(),
      relation: input.relation,
      parentName: input.relation === "parent" ? input.parentName?.trim() : undefined,
      profileImagePlaceholder: `profile-${id}.jpg`,
    };
    setExtraStudents((prev) => [...prev, student]);
    return student;
  }, []);

  const updateStudent = useCallback((id: string, input: NewStudentInput) => {
    const existingStudent = [...seedStudents, ...extraStudents].find((student) => student.id === id);
    if (!existingStudent) return null;

    const updatedStudent: Student = {
      ...existingStudent,
      fullName: input.fullName.trim(),
      age: input.age,
      level: input.level,
      shirtSize: input.shirtSize,
      phone: input.phone.trim(),
      email: input.email.trim(),
      relation: input.relation,
      parentName: input.relation === "parent" ? input.parentName?.trim() : undefined,
    };

    setEditedStudentsById((prev) => ({ ...prev, [id]: updatedStudent }));
    return updatedStudent;
  }, [extraStudents]);

  const addDance = useCallback((input: NewDanceInput) => {
    const id = `d-${Date.now()}`;
    const dance: Dance = {
      id,
      name: input.name.trim(),
      source: input.source ?? "troupe",
      durationMinutes: input.durationMinutes,
      leadTeacherId: input.leadTeacherId,
      studentIds: [...input.studentIds],
      musicFileUrl: input.musicFileUrl?.trim() || "/music/placeholder.mp3",
    };
    setExtraDances((prev) => [...prev, dance]);
    return dance;
  }, []);

  const addTeacher = useCallback((input: NewTeacherInput) => {
    const id = `t-${Date.now()}`;
    const teacher: Teacher = {
      id,
      fullName: input.fullName.trim(),
      specialty: input.specialty.trim(),
      profileImagePlaceholder: `profile-${id}.jpg`,
    };
    setExtraTeachers((prev) => [...prev, teacher]);
    return teacher;
  }, []);

  const value = useMemo(
    () => ({ students, dances, teachers, addStudent, updateStudent, addDance, addTeacher, ready }),
    [students, dances, teachers, addStudent, updateStudent, addDance, addTeacher, ready],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
