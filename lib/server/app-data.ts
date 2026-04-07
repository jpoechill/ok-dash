import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BudgetCategory,
  ExpenseItem,
  GrantItem,
  ProgramMilestone,
  WishlistItem,
} from "@/lib/admin-mock-data";
import type { AppSnapshot } from "@/lib/app-snapshot";
import type { CurrentYearPlan, Dance, Student, Teacher } from "@/lib/mvp-data";

export type { AppSnapshot };

type StudentRow = {
  id: string;
  full_name: string;
  age: number;
  level: string;
  shirt_size: string;
  phone: string;
  email: string;
  relation: string;
  parent_name: string | null;
  profile_image_placeholder: string;
};

type TeacherRow = {
  id: string;
  full_name: string;
  specialty: string;
  profile_image_placeholder: string;
};

type DanceRow = {
  id: string;
  name: string;
  source: string;
  duration_minutes: number;
  lead_teacher_id: string;
  music_file_url: string;
  student_ids: unknown;
};

function rowToStudent(row: StudentRow): Student {
  return {
    id: row.id,
    fullName: row.full_name,
    age: row.age,
    level: row.level as Student["level"],
    shirtSize: row.shirt_size as Student["shirtSize"],
    phone: row.phone,
    email: row.email,
    relation: row.relation as Student["relation"],
    parentName: row.parent_name ?? undefined,
    profileImagePlaceholder: row.profile_image_placeholder,
  };
}

function rowToTeacher(row: TeacherRow): Teacher {
  return {
    id: row.id,
    fullName: row.full_name,
    specialty: row.specialty,
    profileImagePlaceholder: row.profile_image_placeholder,
  };
}

function rowToDance(row: DanceRow): Dance {
  const ids = Array.isArray(row.student_ids)
    ? (row.student_ids as string[])
    : typeof row.student_ids === "string"
      ? (JSON.parse(row.student_ids) as string[])
      : [];
  return {
    id: row.id,
    name: row.name,
    source: row.source as Dance["source"],
    durationMinutes: row.duration_minutes,
    leadTeacherId: row.lead_teacher_id,
    studentIds: ids,
    musicFileUrl: row.music_file_url,
  };
}

function sortStudents(list: Student[]): Student[] {
  return [...list].sort((a, b) => {
    const na = /^s(\d+)$/.exec(a.id)?.[1];
    const nb = /^s(\d+)$/.exec(b.id)?.[1];
    if (na && nb) return Number(na) - Number(nb);
    if (na) return -1;
    if (nb) return 1;
    return a.fullName.localeCompare(b.fullName);
  });
}

function sortDances(list: Dance[]): Dance[] {
  return [...list].sort((a, b) => {
    const na = /^d(\d+)$/.exec(a.id)?.[1];
    const nb = /^d(\d+)$/.exec(b.id)?.[1];
    if (na && nb) return Number(na) - Number(nb);
    return a.id.localeCompare(b.id);
  });
}

export async function fetchAppSnapshot(supabase: SupabaseClient): Promise<AppSnapshot> {
  const [
    studentsRes,
    teachersRes,
    dancesRes,
    grantsRes,
    expensesRes,
    wishlistRes,
    milestonesRes,
    budgetsRes,
    metaRes,
  ] = await Promise.all([
    supabase.from("students").select("*"),
    supabase.from("teachers").select("*"),
    supabase.from("dances").select("*"),
    supabase.from("grants").select("*"),
    supabase.from("expenses").select("*"),
    supabase.from("wishlist_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("program_milestones").select("*"),
    supabase.from("budget_categories").select("*"),
    supabase.from("app_meta").select("*").eq("id", "main").maybeSingle(),
  ]);

  const errors = [
    studentsRes.error,
    teachersRes.error,
    dancesRes.error,
    grantsRes.error,
    expensesRes.error,
    wishlistRes.error,
    milestonesRes.error,
    budgetsRes.error,
    metaRes.error,
  ].filter(Boolean);
  if (errors.length) {
    throw new Error(errors.map((e) => e!.message).join("; "));
  }

  const students = sortStudents((studentsRes.data as StudentRow[] | null)?.map(rowToStudent) ?? []);
  const teachers = ((teachersRes.data as TeacherRow[] | null)?.map(rowToTeacher) ?? []).sort((a, b) =>
    a.fullName.localeCompare(b.fullName),
  );
  const dances = sortDances((dancesRes.data as DanceRow[] | null)?.map(rowToDance) ?? []);

  const grants: GrantItem[] =
    (grantsRes.data as
      | {
          id: string;
          name: string;
          funder: string;
          status: string;
          funding_result: string;
          potential_amount: string | number;
          due_date: string;
          focus: string;
          notes: string;
        }[]
      | null)?.map((g) => ({
      id: g.id,
      name: g.name,
      funder: g.funder,
      status: g.status as GrantItem["status"],
      fundingResult: g.funding_result as GrantItem["fundingResult"],
      potentialAmount: Number(g.potential_amount),
      dueDate: g.due_date,
      focus: g.focus,
      notes: g.notes,
    })) ?? [];

  const expenses: ExpenseItem[] =
    (expensesRes.data as
      | {
          id: string;
          date: string;
          category: string;
          vendor: string;
          description: string;
          amount: string | number;
          status: string;
        }[]
      | null)?.map((e) => ({
      id: e.id,
      date: e.date,
      category: e.category as ExpenseItem["category"],
      vendor: e.vendor,
      description: e.description,
      amount: Number(e.amount),
      status: e.status as ExpenseItem["status"],
    })) ?? [];

  const wishlist: WishlistItem[] =
    (wishlistRes.data as
      | {
          id: string;
          label: string;
          estimated_amount: string | number;
          category: string;
          note: string | null;
          amount_suffix: string | null;
          added_by: string | null;
        }[]
      | null)?.map((w) => ({
      id: w.id,
      label: w.label,
      estimatedAmount: Number(w.estimated_amount),
      category: w.category as WishlistItem["category"],
      note: w.note ?? undefined,
      amountSuffix: w.amount_suffix ?? undefined,
      addedBy: w.added_by ?? undefined,
    })) ?? [];

  const programMilestones: ProgramMilestone[] =
    (milestonesRes.data as
      | {
          id: string;
          week_of: string;
          focus: string;
          owner: string;
          completed: boolean;
        }[]
      | null)?.map((p) => ({
      id: p.id,
      weekOf: p.week_of,
      focus: p.focus,
      owner: p.owner,
      completed: p.completed,
    })) ?? [];

  const budgetCategories: BudgetCategory[] =
    (budgetsRes.data as
      | {
          id: string;
          name: string;
          planned: string | number;
          spent: string | number;
        }[]
      | null)?.map((b) => ({
      id: b.id,
      name: b.name,
      planned: Number(b.planned),
      spent: Number(b.spent),
    })) ?? [];

  const meta = metaRes.data as { year: number; theme: string; notes: string } | null;
  const currentYearPlan: CurrentYearPlan = meta
    ? {
        year: meta.year,
        theme: meta.theme,
        notes: meta.notes,
        danceIds: dances.map((d) => d.id),
      }
    : {
        year: new Date().getFullYear(),
        theme: "",
        notes: "",
        danceIds: dances.map((d) => d.id),
      };

  return {
    students,
    teachers,
    dances,
    grants,
    expenses,
    wishlist,
    programMilestones,
    budgetCategories,
    currentYearPlan,
  };
}
