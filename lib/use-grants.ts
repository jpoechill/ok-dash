"use client";

import { useDashboard } from "@/components/dashboard-provider";

export type { NewGrantInput } from "@/lib/dashboard-input-types";

export function useGrants() {
  const d = useDashboard();
  return {
    grants: d.grants,
    addGrant: d.addGrant,
    updateGrant: d.updateGrant,
    ready: d.ready,
    initialized: d.initialized,
    loadError: d.loadError,
  };
}
