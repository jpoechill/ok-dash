import type { Metadata } from "next";
import { grantItems } from "@/lib/admin-mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const grant = grantItems.find((g) => g.id === id);
  if (!grant) {
    return {
      title: "Grant",
      description: "Grant details",
    };
  }
  const description =
    grant.focus.length > 160 ? `${grant.focus.slice(0, 157)}…` : grant.focus;
  return {
    title: `${grant.name} · Grants`,
    description,
  };
}

export default function GrantDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
