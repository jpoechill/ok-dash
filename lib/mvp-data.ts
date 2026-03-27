export type Student = {
  id: string;
  fullName: string;
  age: number;
  level: "youth" | "young adult" | "adult";
  shirtSize: "XS" | "S" | "M" | "L" | "XL";
  /** Primary contact phone (parent/guardian when relation is parent). */
  phone: string;
  email: string;
  relation: "parent" | "self";
  /** When relation is parent, guardian name for reference. */
  parentName?: string;
  profileImagePlaceholder: string;
};

export type Teacher = {
  id: string;
  fullName: string;
  specialty: string;
  profileImagePlaceholder: string;
};

export type Dance = {
  id: string;
  name: string;
  /** Troupe repertoire vs. pieces brought in by partner organizations (guest spots). */
  source: "troupe" | "guest_collaboration";
  durationMinutes: number;
  leadTeacherId: string;
  studentIds: string[];
  /** Public URL path to rehearsal/performance audio (served from /public). */
  musicFileUrl: string;
};

export type CurrentYearPlan = {
  year: number;
  theme: string;
  danceIds: string[];
  notes: string;
};

const MOCK_GIVEN = [
  "Maly",
  "Sophea",
  "Bopha",
  "Piseth",
  "Sreypov",
  "Vannak",
  "Chantha",
  "Dara",
  "Kunthea",
  "Ratanak",
] as const;
const MOCK_FAMILY = [
  "Chann",
  "Nget",
  "Keo",
  "Ly",
  "Kim",
  "Em",
  "Meas",
  "Sok",
] as const;

function buildMockStudents(count: number): Student[] {
  const levels: Student["level"][] = ["youth", "young adult", "adult"];
  const shirts: Student["shirtSize"][] = ["XS", "S", "M", "L", "XL"];
  const out: Student[] = [];
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    const id = `s${n}`;
    const family = MOCK_FAMILY[Math.floor(i / MOCK_GIVEN.length)]!;
    const fullName = `${MOCK_GIVEN[i % MOCK_GIVEN.length]!} ${family}`;
    const relation: Student["relation"] = i % 3 === 0 ? "parent" : "self";
    const slug = fullName.toLowerCase().replace(/\s+/g, ".");
    out.push({
      id,
      fullName,
      age: 11 + (i % 10),
      level: levels[i % levels.length]!,
      shirtSize: shirts[i % shirts.length]!,
      phone: `510-555-${String(1000 + i).padStart(4, "0")}`,
      email: `${slug}.${n}@email.com`,
      relation,
      parentName:
        relation === "parent"
          ? `${MOCK_GIVEN[(i + 4) % MOCK_GIVEN.length]!} ${family}`
          : undefined,
      profileImagePlaceholder: `profile-${id}.jpg`,
    });
  }
  return out;
}

/** Eighty unique mock dancers (s1–s80). */
export const students: Student[] = buildMockStudents(80);

export const teachers: Teacher[] = [
  {
    id: "t1",
    fullName: "Neary Touch",
    specialty: "Classical hand gestures",
    profileImagePlaceholder: "profile-t1.jpg",
  },
  {
    id: "t2",
    fullName: "Rithy Heng",
    specialty: "Folk choreography",
    profileImagePlaceholder: "profile-t2.jpg",
  },
  {
    id: "t3",
    fullName: "Sokunthea Rin",
    specialty: "Youth performance coaching",
    profileImagePlaceholder: "profile-t3.jpg",
  },
  {
    id: "t4",
    fullName: "Khemara Meas",
    specialty: "Group formations & spacing",
    profileImagePlaceholder: "profile-t4.jpg",
  },
  {
    id: "t5",
    fullName: "Veasna Em",
    specialty: "Guest piece coordination",
    profileImagePlaceholder: "profile-t5.jpg",
  },
  {
    id: "t6",
    fullName: "Malida Sok",
    specialty: "Stage presence & transitions",
    profileImagePlaceholder: "profile-t6.jpg",
  },
  {
    id: "t7",
    fullName: "Pich Rath",
    specialty: "Classical repertoire",
    profileImagePlaceholder: "profile-t7.jpg",
  },
  {
    id: "t8",
    fullName: "Sophea Chann",
    specialty: "Youth ensemble coaching",
    profileImagePlaceholder: "profile-t8.jpg",
  },
  {
    id: "t9",
    fullName: "Vannak Nget",
    specialty: "Costume & movement",
    profileImagePlaceholder: "profile-t9.jpg",
  },
  {
    id: "t10",
    fullName: "Bopha Keo",
    specialty: "Large ensemble staging",
    profileImagePlaceholder: "profile-t10.jpg",
  },
];

/** Music files cycle d1–d5 for early lineup slots; remaining use placeholder until tracks are added. */
function musicForDanceIndex(index: number): string {
  if (index < 5) return `/music/d${index + 1}.mp3`;
  return "/music/placeholder.mp3";
}

/**
 * Mock rosters: 80 students, each in exactly one dance (80 slots ÷ 80 = 1 dance per student on average).
 * No student in more than two dances. Thirteen dances: eleven with 6 dancers, two with 7.
 */
const DANCE_ROSTER_KEYS = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13"] as const;
const SLOTS_PER_DANCE = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7] as const;

function buildRosterByDance(): Record<(typeof DANCE_ROSTER_KEYS)[number], string[]> {
  const allIds = Array.from({ length: 80 }, (_, i) => `s${i + 1}`);
  const roster = {} as Record<(typeof DANCE_ROSTER_KEYS)[number], string[]>;
  let offset = 0;
  for (let i = 0; i < DANCE_ROSTER_KEYS.length; i++) {
    const key = DANCE_ROSTER_KEYS[i]!;
    const n = SLOTS_PER_DANCE[i]!;
    roster[key] = allIds.slice(offset, offset + n);
    offset += n;
  }
  return roster;
}

const ROSTER_BY_DANCE = buildRosterByDance();

export const dances: Dance[] = [
  {
    id: "d1",
    name: "Blessing Dance",
    source: "troupe",
    durationMinutes: 5,
    leadTeacherId: "t3",
    studentIds: ROSTER_BY_DANCE.d1,
    musicFileUrl: musicForDanceIndex(0),
  },
  {
    id: "d2",
    name: "Tivea Propei",
    source: "troupe",
    durationMinutes: 6,
    leadTeacherId: "t1",
    studentIds: ROSTER_BY_DANCE.d2,
    musicFileUrl: musicForDanceIndex(1),
  },
  {
    id: "d3",
    name: "Umbrella Dance",
    source: "troupe",
    durationMinutes: 7,
    leadTeacherId: "t2",
    studentIds: ROSTER_BY_DANCE.d3,
    musicFileUrl: musicForDanceIndex(2),
  },
  {
    id: "d4",
    name: "Khmer Traditional Fashion Show",
    source: "troupe",
    durationMinutes: 8,
    leadTeacherId: "t2",
    studentIds: ROSTER_BY_DANCE.d4,
    musicFileUrl: musicForDanceIndex(3),
  },
  {
    id: "d5",
    name: "Phuong Neary",
    source: "troupe",
    durationMinutes: 6,
    leadTeacherId: "t1",
    studentIds: ROSTER_BY_DANCE.d5,
    musicFileUrl: musicForDanceIndex(4),
  },
  {
    id: "d6",
    name: "Robam Nessat (Fishing Dance)",
    source: "troupe",
    durationMinutes: 7,
    leadTeacherId: "t4",
    studentIds: ROSTER_BY_DANCE.d6,
    musicFileUrl: musicForDanceIndex(5),
  },
  {
    id: "d7",
    name: "Bopha Lokey (Guest Performance)",
    source: "guest_collaboration",
    durationMinutes: 5,
    leadTeacherId: "t5",
    studentIds: ROSTER_BY_DANCE.d7,
    musicFileUrl: musicForDanceIndex(6),
  },
  {
    id: "d8",
    name: "Khmer New Year Blessing",
    source: "troupe",
    durationMinutes: 6,
    leadTeacherId: "t3",
    studentIds: ROSTER_BY_DANCE.d8,
    musicFileUrl: musicForDanceIndex(7),
  },
  {
    id: "d9",
    name: "Moon Love",
    source: "troupe",
    durationMinutes: 7,
    leadTeacherId: "t6",
    studentIds: ROSTER_BY_DANCE.d9,
    musicFileUrl: musicForDanceIndex(8),
  },
  {
    id: "d10",
    name: "Apsara Dance (Guest Performance)",
    source: "guest_collaboration",
    durationMinutes: 8,
    leadTeacherId: "t7",
    studentIds: ROSTER_BY_DANCE.d10,
    musicFileUrl: musicForDanceIndex(9),
  },
  {
    id: "d11",
    name: "Peacock Pailin (Guest Performance)",
    source: "guest_collaboration",
    durationMinutes: 7,
    leadTeacherId: "t8",
    studentIds: ROSTER_BY_DANCE.d11,
    musicFileUrl: musicForDanceIndex(10),
  },
  {
    id: "d12",
    name: "Preap Sor (Guest Performance)",
    source: "guest_collaboration",
    durationMinutes: 6,
    leadTeacherId: "t9",
    studentIds: ROSTER_BY_DANCE.d12,
    musicFileUrl: musicForDanceIndex(11),
  },
  {
    id: "d13",
    name: "Sovann Macha",
    source: "troupe",
    durationMinutes: 8,
    leadTeacherId: "t10",
    studentIds: ROSTER_BY_DANCE.d13,
    musicFileUrl: musicForDanceIndex(12),
  },
];

export const currentYearPlan: CurrentYearPlan = {
  year: 2026,
  theme: "Living Heritage",
  danceIds: dances.map((dance) => dance.id),
  notes: "This season's full lineup—thirteen pieces plus guest spots—about eighty dancers, and ten teachers (no more than two pieces each).",
};

export const dashboardSummary = {
  year: currentYearPlan.year,
  danceCount: dances.length,
  studentCount: students.length,
  teacherCount: teachers.length,
  totalShowMinutes: dances.reduce((total, dance) => total + dance.durationMinutes, 0),
};
