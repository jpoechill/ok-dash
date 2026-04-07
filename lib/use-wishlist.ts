"use client";

import { useCallback, useMemo } from "react";
import { useDashboard } from "@/components/dashboard-provider";
import type { WishlistItem } from "@/lib/admin-mock-data";

export type NewWishlistInput = Omit<WishlistItem, "id">;

export function useWishlist() {
  const {
    wishlist: items,
    addWishlistItem,
    removeWishlistItem,
    reorderWishlist,
    updateWishlistNote,
    ready,
    initialized,
    loadError,
  } = useDashboard();

  const addItem = useCallback(
    async (input: NewWishlistInput) => {
      await addWishlistItem(input);
    },
    [addWishlistItem],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await removeWishlistItem(id);
    },
    [removeWishlistItem],
  );

  const reorderItems = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      const next = [...items];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      await reorderWishlist(next.map((w) => w.id));
    },
    [items, reorderWishlist],
  );

  const updateItemNote = useCallback(
    async (id: string, note: string) => {
      await updateWishlistNote(id, note);
    },
    [updateWishlistNote],
  );

  return useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      reorderItems,
      updateItemNote,
      ready,
      initialized,
      loadError,
    }),
    [items, addItem, removeItem, reorderItems, updateItemNote, ready, initialized, loadError],
  );
}
