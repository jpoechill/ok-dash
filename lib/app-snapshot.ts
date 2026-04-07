import type {
  BudgetCategory,
  ExpenseItem,
  GrantItem,
  ProgramMilestone,
  WishlistItem,
} from "@/lib/admin-mock-data";
import type { CurrentYearPlan, Dance, Student, Teacher } from "@/lib/mvp-data";

export type AppSnapshot = {
  students: Student[];
  teachers: Teacher[];
  dances: Dance[];
  grants: GrantItem[];
  expenses: ExpenseItem[];
  wishlist: WishlistItem[];
  programMilestones: ProgramMilestone[];
  budgetCategories: BudgetCategory[];
  currentYearPlan: CurrentYearPlan;
};
