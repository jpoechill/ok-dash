import type { SupabaseClient } from "@supabase/supabase-js";
import type { GrantItem, WishlistItem } from "@/lib/admin-mock-data";
import type { NewDanceInput, NewStudentInput, NewTeacherInput } from "@/lib/dashboard-input-types";

export async function mutateData(
  supabase: SupabaseClient,
  body: unknown,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!body || typeof body !== "object") {
    return { error: "Invalid body", status: 400 };
  }
  const action = (body as { action?: string }).action;
  const payload = (body as { payload?: unknown }).payload;

  try {
    switch (action) {
      case "addStudent": {
        const input = payload as NewStudentInput;
        const id = `s-${Date.now()}`;
        const { error } = await supabase.from("students").insert({
          id,
          full_name: input.fullName.trim(),
          age: input.age,
          level: input.level,
          shirt_size: input.shirtSize,
          phone: input.phone.trim(),
          email: input.email.trim(),
          relation: input.relation,
          parent_name: input.relation === "parent" ? input.parentName?.trim() ?? null : null,
          profile_image_placeholder: `profile-${id}.jpg`,
        });
        if (error) throw error;
        return { ok: true };
      }
      case "updateStudent": {
        const p = payload as { id: string } & NewStudentInput;
        const { error } = await supabase
          .from("students")
          .update({
            full_name: p.fullName.trim(),
            age: p.age,
            level: p.level,
            shirt_size: p.shirtSize,
            phone: p.phone.trim(),
            email: p.email.trim(),
            relation: p.relation,
            parent_name: p.relation === "parent" ? p.parentName?.trim() ?? null : null,
          })
          .eq("id", p.id);
        if (error) throw error;
        return { ok: true };
      }
      case "addDance": {
        const input = payload as NewDanceInput;
        const id = `d-${Date.now()}`;
        const { error } = await supabase.from("dances").insert({
          id,
          name: input.name.trim(),
          source: input.source ?? "troupe",
          duration_minutes: input.durationMinutes,
          lead_teacher_id: input.leadTeacherId,
          music_file_url: input.musicFileUrl?.trim() || "/music/placeholder.mp3",
          student_ids: input.studentIds,
        });
        if (error) throw error;
        return { ok: true };
      }
      case "addTeacher": {
        const input = payload as NewTeacherInput;
        const id = `t-${Date.now()}`;
        const { error } = await supabase.from("teachers").insert({
          id,
          full_name: input.fullName.trim(),
          specialty: input.specialty.trim(),
          profile_image_placeholder: `profile-${id}.jpg`,
        });
        if (error) throw error;
        return { ok: true };
      }
      case "addGrant": {
        const input = payload as {
          name: string;
          funder: string;
          status: GrantItem["status"];
          fundingResult: GrantItem["fundingResult"];
          potentialAmount: number;
          dueDate: string;
          focus: string;
          notes: string;
        };
        const id = `g-${Date.now()}`;
        const { error } = await supabase.from("grants").insert({
          id,
          name: input.name.trim(),
          funder: input.funder.trim(),
          status: input.status,
          funding_result: input.fundingResult,
          potential_amount: input.potentialAmount,
          due_date: input.dueDate,
          focus: input.focus.trim(),
          notes: input.notes.trim(),
        });
        if (error) throw error;
        return { ok: true };
      }
      case "updateGrant": {
        const p = payload as {
          id: string;
          patch: Partial<Pick<GrantItem, "status" | "fundingResult">>;
        };
        const row: Record<string, unknown> = {};
        if (p.patch.status !== undefined) row.status = p.patch.status;
        if (p.patch.fundingResult !== undefined) row.funding_result = p.patch.fundingResult;
        const { error } = await supabase.from("grants").update(row).eq("id", p.id);
        if (error) throw error;
        return { ok: true };
      }
      case "addWishlistItem": {
        const input = payload as Omit<WishlistItem, "id">;
        const id = `w-${Date.now()}`;
        const { data: top } = await supabase
          .from("wishlist_items")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle();
        const sortOrder = (typeof top?.sort_order === "number" ? top.sort_order : -1) + 1;
        const { error } = await supabase.from("wishlist_items").insert({
          id,
          label: input.label.trim(),
          estimated_amount: input.estimatedAmount,
          category: input.category,
          note: input.note?.trim() ?? null,
          amount_suffix: input.amountSuffix ?? null,
          added_by: input.addedBy ?? null,
          sort_order: sortOrder,
        });
        if (error) throw error;
        return { ok: true };
      }
      case "removeWishlistItem": {
        const id = (payload as { id: string }).id;
        const { error } = await supabase.from("wishlist_items").delete().eq("id", id);
        if (error) throw error;
        return { ok: true };
      }
      case "reorderWishlist": {
        const orderedIds = (payload as { orderedIds: string[] }).orderedIds;
        for (let i = 0; i < orderedIds.length; i++) {
          const { error } = await supabase
            .from("wishlist_items")
            .update({ sort_order: i })
            .eq("id", orderedIds[i]!);
          if (error) throw error;
        }
        return { ok: true };
      }
      case "updateWishlistNote": {
        const p = payload as { id: string; note: string };
        const trimmed = p.note.trim();
        const { error } = await supabase
          .from("wishlist_items")
          .update({ note: trimmed || null })
          .eq("id", p.id);
        if (error) throw error;
        return { ok: true };
      }
      default:
        return { error: "Unknown action", status: 400 };
    }
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : typeof e === "object" &&
            e !== null &&
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Mutation failed";
    return { error: message, status: 500 };
  }
}
