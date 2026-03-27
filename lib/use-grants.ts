"use client";

import { useEffect, useMemo, useState } from "react";
import { grantItems, type GrantItem } from "@/lib/admin-mock-data";

/** Bump when seed list resets so browsers load fresh grants instead of merging old localStorage rows. */
const STORAGE_GRANTS = "dashboard-grants-v3";

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

export function useGrants() {
  const [grants, setGrants] = useState<GrantItem[]>(grantItems);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_GRANTS);
      if (raw) {
        const stored = JSON.parse(raw) as GrantItem[];
        // Keep only current seeded grants plus user-created grants (ids like g-<timestamp>).
        const storedFiltered = stored.filter(
          (savedGrant) =>
            grantItems.some((seedGrant) => seedGrant.id === savedGrant.id) ||
            savedGrant.id.startsWith("g-"),
        );
        const merged = [
          ...grantItems.map(
            (seedGrant) => storedFiltered.find((savedGrant) => savedGrant.id === seedGrant.id) ?? seedGrant,
          ),
          ...storedFiltered.filter(
            (savedGrant) => !grantItems.some((seedGrant) => seedGrant.id === savedGrant.id),
          ),
        ];
        setGrants(merged);
      }
    } catch {
      setGrants(grantItems);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_GRANTS, JSON.stringify(grants));
  }, [grants, ready]);

  function addGrant(input: NewGrantInput) {
    const newGrant: GrantItem = {
      id: `g-${Date.now()}`,
      name: input.name.trim(),
      funder: input.funder.trim(),
      status: input.status,
      fundingResult: input.fundingResult,
      potentialAmount: input.potentialAmount,
      dueDate: input.dueDate,
      focus: input.focus.trim(),
      notes: input.notes.trim(),
    };
    setGrants((prev) => [...prev, newGrant]);
    return newGrant;
  }

  function updateGrant(id: string, patch: Partial<Pick<GrantItem, "status" | "fundingResult">>) {
    setGrants((prev) => prev.map((grant) => (grant.id === id ? { ...grant, ...patch } : grant)));
  }

  return useMemo(
    () => ({
      grants,
      addGrant,
      updateGrant,
      ready,
    }),
    [grants, ready],
  );
}
