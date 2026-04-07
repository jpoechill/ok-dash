"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-shell";
import { type WishlistItem } from "@/lib/admin-mock-data";
import { useWishlist } from "@/lib/use-wishlist";

const wishlistCategories: WishlistItem["category"][] = [
  "Costumes",
  "Music",
  "Venue",
  "Transport",
  "Food",
  "Marketing",
  "Operations",
];

export default function WishlistPage() {
  const { data: session } = useSession();
  const {
    items: wishlist,
    addItem,
    removeItem,
    reorderItems,
    updateItemNote,
    ready: wishlistReady,
    initialized: wishlistInitialized,
    loadError: wishlistLoadError,
  } = useWishlist();
  const [draggingWishIndex, setDraggingWishIndex] = useState<number | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [wishLabel, setWishLabel] = useState("");
  const [wishAmount, setWishAmount] = useState("");
  const [wishCategory, setWishCategory] = useState<WishlistItem["category"]>("Costumes");
  const [wishNote, setWishNote] = useState("");
  const [wishFormOpen, setWishFormOpen] = useState(false);

  const wishlistTotal = wishlist.reduce((sum, item) => sum + item.estimatedAmount, 0);

  async function handleAddWishlist(e: FormEvent) {
    e.preventDefault();
    const amount = Number(wishAmount);
    if (!wishLabel.trim() || !Number.isFinite(amount) || amount < 0) return;
    const addedBy =
      session?.user?.name?.trim() ||
      session?.user?.email?.trim() ||
      "Guest";
    await addItem({
      label: wishLabel.trim(),
      estimatedAmount: amount,
      category: wishCategory,
      note: wishNote.trim() || undefined,
      addedBy,
    });
    setWishLabel("");
    setWishAmount("");
    setWishNote("");
    setWishCategory("Costumes");
    setWishFormOpen(false);
  }

  function openItemNotes(item: WishlistItem) {
    setExpandedItemId((prev) => (prev === item.id ? null : item.id));
    setEditingItemId(null);
    setNoteDraft(item.note ?? "");
  }

  function startEditingNote(item: WishlistItem) {
    setExpandedItemId(item.id);
    setEditingItemId(item.id);
    setNoteDraft(item.note ?? "");
  }

  async function saveItemNote(itemId: string) {
    await updateItemNote(itemId, noteDraft);
    setEditingItemId(null);
  }

  if (!wishlistInitialized) {
    return (
      <AppShell title="Wishlist" subtitle="Loading…">
        <p className="text-sm text-zinc-600">Loading…</p>
      </AppShell>
    );
  }
  if (wishlistLoadError) {
    return (
      <AppShell title="Wishlist" subtitle="Could not load data">
        <p className="text-sm text-rose-600">{wishlistLoadError}</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Wishlist"
      subtitle="Planned purchases not in the expense log yet. Stored in Supabase. Drag a row to reorder."
    >
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-xl text-sm text-zinc-600">
            Track what you hope to fund before it hits the expense log.
          </p>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Estimated total</p>
            <p className="text-xl font-semibold text-zinc-900">
              {wishlistReady ? `$${wishlistTotal.toLocaleString()}` : "…"}
            </p>
          </div>
        </div>

        {!wishlistReady ? (
          <p className="mt-4 text-sm text-zinc-500">Loading wishlist…</p>
        ) : (
          <>
            <ul className="mt-4 space-y-2">
              {wishlist.length === 0 ? (
                <li className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-4 text-center text-sm text-zinc-500">
                  Nothing on the wishlist yet.{" "}
                  <button
                    type="button"
                    onClick={() => setWishFormOpen(true)}
                    className="font-medium text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
                  >
                    Add an item
                  </button>
                </li>
              ) : null}
              {wishlist.map((item, index) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(e: DragEvent<HTMLLIElement>) => {
                    e.dataTransfer.setData("text/plain", String(index));
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingWishIndex(index);
                  }}
                  onDragEnd={() => setDraggingWishIndex(null)}
                  onDragOver={(e: DragEvent<HTMLLIElement>) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e: DragEvent<HTMLLIElement>) => {
                    e.preventDefault();
                    const from = Number(e.dataTransfer.getData("text/plain"));
                    if (Number.isNaN(from)) return;
                    reorderItems(from, index);
                    setDraggingWishIndex(null);
                  }}
                  className={`flex flex-wrap items-start justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm select-none ${
                    draggingWishIndex === index ? "opacity-50" : ""
                  } cursor-grab active:cursor-grabbing`}
                >
                  <div className="flex min-w-0 flex-1 gap-2">
                    <span
                      className="mt-0.5 shrink-0 text-zinc-400"
                      aria-hidden
                      title="Drag to reorder"
                    >
                      <svg width="12" height="16" viewBox="0 0 12 16" className="text-current" aria-hidden>
                        <circle cx="3" cy="3" r="1.5" fill="currentColor" />
                        <circle cx="9" cy="3" r="1.5" fill="currentColor" />
                        <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="9" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="3" cy="13" r="1.5" fill="currentColor" />
                        <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">{item.label}</p>
                      <p className="text-zinc-600">{item.category}</p>
                      {item.note ? <p className="mt-1 text-sm text-zinc-600">{item.note}</p> : null}
                      <p className="mt-1 text-xs text-zinc-500">
                        Added by{" "}
                        <span className="font-medium text-zinc-600">
                          {item.addedBy ?? "Not recorded"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-medium text-zinc-900">
                      ${item.estimatedAmount.toLocaleString()}
                      {item.amountSuffix ? (
                        <span className="font-normal text-zinc-600">{item.amountSuffix}</span>
                      ) : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => openItemNotes(item)}
                      className="cursor-pointer rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 hover:border-amber-300 hover:text-zinc-900"
                      aria-expanded={expandedItemId === item.id}
                    >
                      {expandedItemId === item.id ? "Hide notes" : "Notes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="cursor-pointer rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 hover:border-amber-300 hover:text-zinc-900"
                      aria-label={`Remove ${item.label}`}
                    >
                      Remove
                    </button>
                  </div>
                  {expandedItemId === item.id ? (
                    <div className="w-full border-t border-zinc-200 pt-2">
                      {editingItemId === item.id ? (
                        <div className="grid gap-2">
                          <label className="grid gap-1 text-xs">
                            <span className="text-zinc-600">Notes</span>
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              rows={3}
                              placeholder="Add details for this item"
                              className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => saveItemNote(item.id)}
                              className="rounded-full bg-amber-800 px-3 py-1 text-xs font-medium text-white hover:bg-amber-900"
                            >
                              Save note
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemId(null);
                                setNoteDraft(item.note ?? "");
                              }}
                              className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-sm text-zinc-600">{item.note || "No notes yet."}</p>
                          <button
                            type="button"
                            onClick={() => startEditingNote(item)}
                            className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 hover:border-amber-300 hover:text-zinc-900"
                          >
                            {item.note ? "Edit note" : "Add note"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-zinc-100 pt-3">
              <button
                type="button"
                onClick={() => setWishFormOpen((open) => !open)}
                className="flex w-full min-w-0 items-center justify-between gap-2 text-left"
                aria-expanded={wishFormOpen}
              >
                <span className="text-sm font-medium text-zinc-800">Add item</span>
                <span className="text-zinc-400" aria-hidden>
                  {wishFormOpen ? "▾" : "▸"}
                </span>
              </button>

              {wishFormOpen ? (
                <form
                  onSubmit={handleAddWishlist}
                  className="mt-3 grid gap-2 border-t border-zinc-100 pt-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <label className="grid gap-1 text-xs sm:col-span-2">
                    <span className="text-zinc-600">Item</span>
                    <input
                      value={wishLabel}
                      onChange={(e) => setWishLabel(e.target.value)}
                      placeholder="What you hope to buy"
                      className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="grid gap-1 text-xs">
                    <span className="text-zinc-600">Est. amount</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={wishAmount}
                      onChange={(e) => setWishAmount(e.target.value)}
                      placeholder="0"
                      className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="grid gap-1 text-xs">
                    <span className="text-zinc-600">Category</span>
                    <select
                      value={wishCategory}
                      onChange={(e) => setWishCategory(e.target.value as WishlistItem["category"])}
                      className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                    >
                      {wishlistCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs sm:col-span-2 lg:col-span-4">
                    <span className="text-zinc-600">Note (optional)</span>
                    <input
                      value={wishNote}
                      onChange={(e) => setWishNote(e.target.value)}
                      placeholder="Timing, vendor idea, etc."
                      className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <div className="sm:col-span-2 lg:col-span-4">
                    <button
                      type="submit"
                      className="rounded-full bg-amber-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-900"
                    >
                      Add to wishlist
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
