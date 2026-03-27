"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { DashboardProvider } from "@/components/dashboard-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DashboardProvider>{children}</DashboardProvider>
    </SessionProvider>
  );
}
