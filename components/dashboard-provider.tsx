"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { GrantItem, WishlistItem } from "@/lib/admin-mock-data";
import type { AppSnapshot } from "@/lib/app-snapshot";
import type {
  NewDanceInput,
  NewGrantInput,
  NewStudentInput,
  NewTeacherInput,
} from "@/lib/dashboard-input-types";
import type { Dance, Student, Teacher } from "@/lib/mvp-data";

type DashboardContextValue = {
  students: Student[];
  dances: Dance[];
  teachers: Teacher[];
  grants: GrantItem[];
  expenses: AppSnapshot["expenses"];
  wishlist: WishlistItem[];
  programMilestones: AppSnapshot["programMilestones"];
  budgetCategories: AppSnapshot["budgetCategories"];
  currentYearPlan: AppSnapshot["currentYearPlan"];
  addStudent: (input: NewStudentInput) => Promise<void>;
  updateStudent: (id: string, input: NewStudentInput) => Promise<void>;
  addDance: (input: NewDanceInput) => Promise<void>;
  addTeacher: (input: NewTeacherInput) => Promise<void>;
  addGrant: (input: NewGrantInput) => Promise<void>;
  updateGrant: (id: string, patch: Partial<Pick<GrantItem, "status" | "fundingResult">>) => Promise<void>;
  addWishlistItem: (input: Omit<WishlistItem, "id">) => Promise<void>;
  removeWishlistItem: (id: string) => Promise<void>;
  reorderWishlist: (orderedIds: string[]) => Promise<void>;
  updateWishlistNote: (id: string, note: string) => Promise<void>;
  /** True after the first GET /api/data attempt finishes. */
  initialized: boolean;
  /** True when data is available (no load error). */
  ready: boolean;
  loadError: string | null;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

const fetchDataOptions: RequestInit = {
  credentials: "same-origin",
  cache: "no-store",
};

async function postData(action: string, payload: unknown) {
  const res = await fetch("/api/data", {
    ...fetchDataOptions,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
}

function isLoginPath(path: string) {
  return path === "/login" || path.startsWith("/login/");
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadSnapshot = useCallback(async () => {
    const res = await fetch("/api/data", fetchDataOptions);
    const data = (await res.json().catch(() => ({}))) as AppSnapshot & { error?: string };
    setInitialized(true);
    if (!res.ok) {
      setLoadError(data.error || "Failed to load data");
      setSnapshot(null);
      return;
    }
    setLoadError(null);
    setSnapshot(data as AppSnapshot);
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  /** Provider stays mounted across /login → app navigation; refetch after sign-in when cookie is present. */
  useEffect(() => {
    const prev = prevPathname.current;
    prevPathname.current = pathname;
    if (prev === null) return;
    if (isLoginPath(prev) && !isLoginPath(pathname)) {
      void loadSnapshot();
    }
  }, [pathname, loadSnapshot]);

  const addStudent = useCallback(async (input: NewStudentInput) => {
    await postData("addStudent", input);
    await loadSnapshot();
  }, [loadSnapshot]);

  const updateStudent = useCallback(
    async (id: string, input: NewStudentInput) => {
      await postData("updateStudent", { id, ...input });
      await loadSnapshot();
    },
    [loadSnapshot],
  );

  const addDance = useCallback(async (input: NewDanceInput) => {
    await postData("addDance", input);
    await loadSnapshot();
  }, [loadSnapshot]);

  const addTeacher = useCallback(async (input: NewTeacherInput) => {
    await postData("addTeacher", input);
    await loadSnapshot();
  }, [loadSnapshot]);

  const addGrant = useCallback(async (input: NewGrantInput) => {
    await postData("addGrant", input);
    await loadSnapshot();
  }, [loadSnapshot]);

  const updateGrant = useCallback(
    async (id: string, patch: Partial<Pick<GrantItem, "status" | "fundingResult">>) => {
      await postData("updateGrant", { id, patch });
      await loadSnapshot();
    },
    [loadSnapshot],
  );

  const addWishlistItem = useCallback(async (input: Omit<WishlistItem, "id">) => {
    await postData("addWishlistItem", input);
    await loadSnapshot();
  }, [loadSnapshot]);

  const removeWishlistItem = useCallback(async (id: string) => {
    await postData("removeWishlistItem", { id });
    await loadSnapshot();
  }, [loadSnapshot]);

  const reorderWishlist = useCallback(
    async (orderedIds: string[]) => {
      await postData("reorderWishlist", { orderedIds });
      await loadSnapshot();
    },
    [loadSnapshot],
  );

  const updateWishlistNote = useCallback(async (id: string, note: string) => {
    await postData("updateWishlistNote", { id, note });
    await loadSnapshot();
  }, [loadSnapshot]);

  const value = useMemo((): DashboardContextValue => {
    const empty: AppSnapshot = {
      students: [],
      teachers: [],
      dances: [],
      grants: [],
      expenses: [],
      wishlist: [],
      programMilestones: [],
      budgetCategories: [],
      currentYearPlan: {
        year: new Date().getFullYear(),
        theme: "",
        notes: "",
        danceIds: [],
      },
    };
    const s = snapshot ?? empty;
    const ready = initialized && !loadError && snapshot !== null;
    return {
      students: s.students,
      dances: s.dances,
      teachers: s.teachers,
      grants: s.grants,
      expenses: s.expenses,
      wishlist: s.wishlist,
      programMilestones: s.programMilestones,
      budgetCategories: s.budgetCategories,
      currentYearPlan: s.currentYearPlan,
      addStudent,
      updateStudent,
      addDance,
      addTeacher,
      addGrant,
      updateGrant,
      addWishlistItem,
      removeWishlistItem,
      reorderWishlist,
      updateWishlistNote,
      initialized,
      ready,
      loadError,
    };
  }, [
    snapshot,
    loadError,
    initialized,
    addStudent,
    updateStudent,
    addDance,
    addTeacher,
    addGrant,
    updateGrant,
    addWishlistItem,
    removeWishlistItem,
    reorderWishlist,
    updateWishlistNote,
  ]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}

export type { NewStudentInput, NewDanceInput, NewTeacherInput } from "@/lib/dashboard-input-types";
