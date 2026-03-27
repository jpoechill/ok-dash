"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { wishlistItems, type WishlistItem } from "@/lib/admin-mock-data";

const STORAGE_WISHLIST = "dashboard-wishlist";

export type NewWishlistInput = Omit<WishlistItem, "id">;

/** IDs from addItem() — keep when merging so user rows survive; omit removed seed-only rows (e.g. old w1). */
const USER_WISHLIST_ID = /^w-\d+$/;

/** Merge seed defaults with localStorage so new seed rows appear and seed updates apply per id. */
function mergeWishlist(seed: WishlistItem[], stored: WishlistItem[]): WishlistItem[] {
  const seedIds = new Set(seed.map((s) => s.id));
  const seedById = new Map(seed.map((s) => [s.id, s] as const));
  const storedById = new Map(stored.map((s) => [s.id, s] as const));
  const out: WishlistItem[] = [];
  for (const s of seed) {
    const t = storedById.get(s.id);
    out.push(t ? ({ ...s, ...t } satisfies WishlistItem) : s);
  }
  for (const item of stored) {
    if (!seedIds.has(item.id) && USER_WISHLIST_ID.test(item.id)) out.push(item);
  }
  return out;
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_WISHLIST);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        setItems(mergeWishlist(wishlistItems, parsed));
      } else {
        setItems(wishlistItems);
      }
    } catch {
      setItems(wishlistItems);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((input: NewWishlistInput) => {
    const id = `w-${Date.now()}`;
    setItems((prev) => [...prev, { ...input, id }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setItems((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const updateItemNote = useCallback((id: string, note: string) => {
    const trimmed = note.trim();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              note: trimmed || undefined,
            }
          : item,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      reorderItems,
      updateItemNote,
      ready,
    }),
    [items, ready, addItem, removeItem, reorderItems, updateItemNote],
  );
}
