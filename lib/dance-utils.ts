import type { Dance } from "@/lib/mvp-data";

/** Headline title: piece name without redundant guest suffix (role is shown via `source` / badges). */
export function displayDanceTitle(dance: Dance): string {
  const raw = dance.name.trim();
  if (dance.source === "guest_collaboration") {
    const trimmed = raw.replace(/\s*\(Guest Performance\)\s*$/i, "").trim();
    return trimmed || raw;
  }
  return raw;
}

export function partitionDancesBySource(dances: Dance[]) {
  const troupe: Dance[] = [];
  const guest: Dance[] = [];
  for (const dance of dances) {
    const source = dance.source ?? "troupe";
    if (source === "guest_collaboration") guest.push(dance);
    else troupe.push(dance);
  }
  return { troupe, guest };
}
