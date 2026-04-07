/**
 * One-time (or repeatable) seed: run after applying supabase/migrations/001_initial.sql in the Supabase SQL editor.
 * Usage: npm run db:seed
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";
import {
  budgetCategories,
  expenseItems,
  grantItems,
  programMilestones,
  wishlistItems,
} from "../lib/admin-mock-data";
import { currentYearPlan, dances, students, teachers } from "../lib/mvp-data";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key =
  process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local",
  );
  process.exit(1);
}

const sb = createClient(url, key);

async function main() {
  const teacherRows = teachers.map((t) => ({
    id: t.id,
    full_name: t.fullName,
    specialty: t.specialty,
    profile_image_placeholder: t.profileImagePlaceholder,
  }));

  const { error: te } = await sb.from("teachers").upsert(teacherRows, { onConflict: "id" });
  if (te) throw te;

  const studentRows = students.map((s) => ({
    id: s.id,
    full_name: s.fullName,
    age: s.age,
    level: s.level,
    shirt_size: s.shirtSize,
    phone: s.phone,
    email: s.email,
    relation: s.relation,
    parent_name: s.parentName ?? null,
    profile_image_placeholder: s.profileImagePlaceholder,
  }));

  const { error: se } = await sb.from("students").upsert(studentRows, { onConflict: "id" });
  if (se) throw se;

  const danceRows = dances.map((d) => ({
    id: d.id,
    name: d.name,
    source: d.source,
    duration_minutes: d.durationMinutes,
    lead_teacher_id: d.leadTeacherId,
    music_file_url: d.musicFileUrl,
    student_ids: d.studentIds,
  }));

  const { error: de } = await sb.from("dances").upsert(danceRows, { onConflict: "id" });
  if (de) throw de;

  const { error: me } = await sb.from("app_meta").upsert(
    {
      id: "main",
      year: currentYearPlan.year,
      theme: currentYearPlan.theme,
      notes: currentYearPlan.notes,
    },
    { onConflict: "id" },
  );
  if (me) throw me;

  const grantRows = grantItems.map((g) => ({
    id: g.id,
    name: g.name,
    funder: g.funder,
    status: g.status,
    funding_result: g.fundingResult,
    potential_amount: g.potentialAmount,
    due_date: g.dueDate,
    focus: g.focus,
    notes: g.notes,
  }));

  const { error: ge } = await sb.from("grants").upsert(grantRows, { onConflict: "id" });
  if (ge) throw ge;

  const expenseRows = expenseItems.map((e) => ({
    id: e.id,
    date: e.date,
    category: e.category,
    vendor: e.vendor,
    description: e.description,
    amount: e.amount,
    status: e.status,
  }));

  const { error: ee } = await sb.from("expenses").upsert(expenseRows, { onConflict: "id" });
  if (ee) throw ee;

  const wishRows = wishlistItems.map((w, i) => ({
    id: w.id,
    label: w.label,
    estimated_amount: w.estimatedAmount,
    category: w.category,
    note: w.note ?? null,
    amount_suffix: w.amountSuffix ?? null,
    added_by: w.addedBy ?? null,
    sort_order: i,
  }));

  const { error: we } = await sb.from("wishlist_items").upsert(wishRows, { onConflict: "id" });
  if (we) throw we;

  const milestoneRows = programMilestones.map((p) => ({
    id: p.id,
    week_of: p.weekOf,
    focus: p.focus,
    owner: p.owner,
    completed: p.completed,
  }));

  const { error: pe } = await sb.from("program_milestones").upsert(milestoneRows, { onConflict: "id" });
  if (pe) throw pe;

  const budgetRows = budgetCategories.map((b) => ({
    id: b.id,
    name: b.name,
    planned: b.planned,
    spent: b.spent,
  }));

  const { error: be } = await sb.from("budget_categories").upsert(budgetRows, { onConflict: "id" });
  if (be) throw be;

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
