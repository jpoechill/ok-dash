export type ExpenseItem = {
  id: string;
  date: string;
  category: "Costumes" | "Music" | "Venue" | "Transport" | "Food" | "Marketing" | "Operations";
  vendor: string;
  description: string;
  amount: number;
  status: "paid" | "pending";
};

/** Planned purchases not yet in the expense log (tracked separately). */
export type WishlistItem = {
  id: string;
  label: string;
  estimatedAmount: number;
  category: ExpenseItem["category"];
  note?: string;
  /** Shown after the dollar amount (e.g. " (target)"). */
  amountSuffix?: string;
  /** Who added this row (e.g. signed-in user). Older saved rows may omit this. */
  addedBy?: string;
};

export type ProgramMilestone = {
  id: string;
  weekOf: string;
  focus: string;
  owner: string;
  completed: boolean;
};

export type BudgetCategory = {
  id: string;
  name: string;
  planned: number;
  spent: number;
};

export type GrantItem = {
  id: string;
  name: string;
  funder: string;
  status: "to_apply" | "applied";
  fundingResult: "pending" | "funded" | "not_funded";
  potentialAmount: number;
  dueDate: string;
  focus: string;
  notes: string;
};

export const expenseItems: ExpenseItem[] = [
  {
    id: "e1",
    date: "2026-02-05",
    category: "Costumes",
    vendor: "Khmer Silk House",
    description: "Apsara costume repairs",
    amount: 380,
    status: "paid",
  },
  {
    id: "e2",
    date: "2026-02-11",
    category: "Venue",
    vendor: "Oakland Cultural Hall",
    description: "Saturday rehearsal rental",
    amount: 520,
    status: "paid",
  },
  {
    id: "e3",
    date: "2026-02-14",
    category: "Music",
    vendor: "Bay Audio",
    description: "Track cleanup and mastering",
    amount: 260,
    status: "pending",
  },
  {
    id: "e4",
    date: "2026-02-20",
    category: "Transport",
    vendor: "Community Van Service",
    description: "Youth pickup support",
    amount: 190,
    status: "paid",
  },
  {
    id: "e5",
    date: "2026-02-24",
    category: "Food",
    vendor: "Family Market",
    description: "Rehearsal snacks and water",
    amount: 145,
    status: "paid",
  },
  {
    id: "e6",
    date: "2026-03-01",
    category: "Marketing",
    vendor: "Print House SF",
    description: "Spring showcase flyers",
    amount: 210,
    status: "pending",
  },
];

export const wishlistItems: WishlistItem[] = [
  {
    id: "w-offseason-training",
    label: "Off-Season Training System (1-Year Program)",
    estimatedAmount: 25000,
    category: "Venue",
    amountSuffix: " (target)",
    note:
      "Program · Weekly classes, teacher stipends, monthly showcases, dancer progression, and community engagement",
    addedBy: "Not recorded",
  },
  {
    id: "w-apsara-crowns-set",
    label: "Set of 6 Apsara crowns",
    estimatedAmount: 4200,
    category: "Costumes",
    note: "To be ordered from Cambodia",
    addedBy: "Not recorded",
  },
  {
    id: "w-peacock-costume-set",
    label: "Peacock dance costume set",
    estimatedAmount: 2800,
    category: "Costumes",
    note: "To be ordered from Cambodia",
    addedBy: "Not recorded",
  },
  {
    id: "w-2027-nye-temple-hill",
    label: "2027 New Year Event @ Temple Hill",
    estimatedAmount: 20000,
    category: "Venue",
    addedBy: "Not recorded",
  },
  {
    id: "w-yearly-operational-budget",
    label: "Yearly operational budget",
    estimatedAmount: 100000,
    category: "Operations",
    amountSuffix: " (annual)",
    addedBy: "Not recorded",
  },
  {
    id: "w-khmer-language-classes",
    label: "Khmer language classes",
    estimatedAmount: 6000,
    category: "Operations",
    addedBy: "Not recorded",
  },
];

export const programMilestones: ProgramMilestone[] = [
  {
    id: "p1",
    weekOf: "2026-03-09",
    focus: "Umbrella Dance spacing and transitions",
    owner: "Rithy Heng",
    completed: true,
  },
  {
    id: "p2",
    weekOf: "2026-03-16",
    focus: "Peacock Pailin (Guest) hand gesture cleanup",
    owner: "Neary Touch",
    completed: false,
  },
  {
    id: "p3",
    weekOf: "2026-03-23",
    focus: "Blessing Dance & Khmer New Year Blessing full run-through with music",
    owner: "Sokunthea Rin",
    completed: false,
  },
  {
    id: "p4",
    weekOf: "2026-03-30",
    focus: "Full lineup costume check and stage marks",
    owner: "Program Team",
    completed: false,
  },
];

export const budgetCategories: BudgetCategory[] = [
  { id: "b1", name: "Costumes", planned: 1800, spent: 980 },
  { id: "b2", name: "Venue", planned: 2600, spent: 1750 },
  { id: "b3", name: "Music", planned: 1200, spent: 620 },
  { id: "b4", name: "Transport", planned: 900, spent: 430 },
  { id: "b5", name: "Food", planned: 650, spent: 290 },
  { id: "b6", name: "Marketing", planned: 800, spent: 260 },
];

export const grantItems: GrantItem[] = [
  {
    id: "g-ca-arts-youth",
    name: "Arts and Youth",
    funder: "California Arts Council",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 25000,
    dueDate: "2026-05-12",
    focus:
      "The California Arts Council Arts & Youth program funds culturally relevant arts programs for ages 0–25 that expand access and remove barriers, helping underserved youth build skills, identity, and community connection.",
    notes:
      "CA Arts Council: Arts and Youth\n" +
      "https://arts.ca.gov/grant_program/arts-youth/\n\n" +
      "Application Deadline: May 12, 2026, 11:59 PM\n" +
      "Grant Request Amount: Up to $25,000\n" +
      "Grant Activity Period: October 1, 2026 — September 30, 2027\n" +
      "Estimated Arrival of Funds: January — March 2027\n\n" +
      "The California Arts Council Arts & Youth program funds culturally relevant arts programs for ages 0–25 that expand access and remove barriers, helping underserved youth build skills, identity, and community connection.",
  },
  {
    id: "g-ca-general-operating",
    name: "General Operating Support",
    funder: "California Arts Council",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 30000,
    dueDate: "2026-05-12",
    focus:
      "The California Arts Council General Operating Support program provides funding for arts and cultural organizations to sustain ongoing operations, with a focus on equity and expanding access to communities across California.",
    notes:
      "CA Arts Council: General Operating Support\n" +
      "https://arts.ca.gov/grant_program/arts-cultural-organizations-general-operating-support/\n\n" +
      "Application Deadline: May 12, 2026, 11:59 PM\n" +
      "Grant Request Amount: Up to $30,000\n" +
      "Grant Activity Period: October 1, 2026 — September 30, 2027\n" +
      "Estimated Arrival of Funds: January — March 2027\n\n" +
      "The California Arts Council General Operating Support program provides funding for arts and cultural organizations to sustain ongoing operations, with a focus on equity and expanding access to communities across California.",
  },
  {
    id: "g-ca-impact",
    name: "Impact Projects",
    funder: "California Arts Council",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 25000,
    dueDate: "2026-05-12",
    focus:
      "The California Arts Council Impact Projects program supports collaborative arts projects that address community-defined social issues, prioritizing work with historically underserved communities through culturally rooted artistic practices.",
    notes:
      "CA Arts Council: Impact Projects\n" +
      "https://arts.ca.gov/grant_program/impact-projects/\n\n" +
      "Application Deadline: May 12, 2026, 11:59 PM\n" +
      "Grant Request Amount: Up to $25,000\n" +
      "Grant Activity Period: October 1, 2026 — September 30, 2027\n" +
      "Estimated Arrival of Funds: January — March 2027\n\n" +
      "The California Arts Council Impact Projects program supports collaborative arts projects that address community-defined social issues, prioritizing work with historically underserved communities through culturally rooted artistic practices.",
  },
  {
    id: "g-fleish-small-arts",
    name: "Small Arts Grants",
    funder: "Fleishhacker Foundation",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 10000,
    dueDate: "2026-07-15",
    focus:
      "The Fleishhacker Foundation Small Arts Grants program provides unrestricted funding to small and mid-sized Bay Area arts organizations to support operations and artist-driven work, with a priority on organizations serving historically marginalized and under-resourced communities.",
    notes:
      "Fleishhacker Foundation Small Arts Grants\n" +
      "https://www.fleishhackerfoundation.org/programs/small-arts-grants/\n\n" +
      "Application Deadline: July 15, 2026 (Fall cycle)\n" +
      "Grant Request Amount: $5,000–$10,000 (typically closer to $5,000)\n" +
      "Grant Activity Period: Flexible (general support)\n" +
      "Estimated Arrival of Funds: November 2026\n\n" +
      "The Fleishhacker Foundation Small Arts Grants program provides unrestricted funding to small and mid-sized Bay Area arts organizations to support operations and artist-driven work, with a priority on organizations serving historically marginalized and under-resourced communities.",
  },
  {
    id: "g-zff-community-arts",
    name: "Community Arts",
    funder: "Zellerbach Family Foundation",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 15000,
    dueDate: "2026-07-13",
    focus:
      "The Zellerbach Family Foundation Community Arts program provides general operating support to Bay Area artists and small arts organizations to create and present public-facing work, prioritizing projects that engage communities and uplift historically underrepresented groups.",
    notes:
      "Zellerbach Family Foundation Community Arts\n" +
      "https://www.zellerbachfamilyfoundation.org/community-arts/\n\n" +
      "Application Deadline: July 13, 2026\n" +
      "Grant Request Amount: $5,000, $10,000, or $15,000\n" +
      "Grant Activity Period: Flexible (general support tied to a public project)\n" +
      "Estimated Arrival of Funds: October 5, 2026\n\n" +
      "The Zellerbach Family Foundation Community Arts program provides general operating support to Bay Area artists and small arts organizations to create and present public-facing work, prioritizing projects that engage communities and uplift historically underrepresented groups.",
  },
  {
    id: "g-apf-community-funds",
    name: "General Grantmaking / Community Funds",
    funder: "Asian Pacific Fund",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 25000,
    dueDate: "2026-12-31",
    focus:
      "The Asian Pacific Fund supports Bay Area nonprofit organizations serving AAPI communities through community funds, donor-advised grants, and special initiatives—prioritizing cultural preservation, youth development, community health, and social equity.",
    notes:
      "Asian Pacific Fund (General Grantmaking / Community Funds)\n" +
      "https://asianpacificfund.org/\n\n" +
      "Application Deadline: Rolling / Varies by program (often invite-based or LOI first)\n" +
      "Grant Request Amount: Varies (commonly $5,000–$25,000 depending on fund)\n" +
      "Grant Activity Period: Varies by program (typically 6–12 months)\n" +
      "Estimated Arrival of Funds: Varies (often 2–4 months after approval)\n\n" +
      "The Asian Pacific Fund supports Bay Area nonprofit organizations serving AAPI communities through a combination of community funds, donor-advised grants, and special initiatives. Funding prioritizes programs focused on cultural preservation, youth development, community health, and social equity. Many opportunities are not openly advertised and may require relationship-building, partnership alignment, or a Letter of Inquiry (LOI) before being invited to submit a full proposal.",
  },
  {
    id: "g-acgov-artsfund",
    name: "ARTSFUND Grant Program",
    funder: "Alameda County Arts Commission",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 2500,
    dueDate: "2026-02-05",
    focus:
      "The Alameda County Arts Commission ARTSFUND program provides small general operating grants to Alameda County arts and cultural nonprofits to support ongoing programs, administration, and community arts services.",
    notes:
      "ARTSFUND Grant Program\n" +
      "https://www.acgov.org/artsfund/\n\n" +
      "Application Deadline: February 5, 2026, 5:00 PM\n" +
      "Grant Request Amount: $2,500\n" +
      "Grant Activity Period: Flexible (general operating support)\n" +
      "Estimated Arrival of Funds: Not specified\n\n" +
      "The Alameda County Arts Commission ARTSFUND program provides small general operating grants to Alameda County arts and cultural nonprofits to support ongoing programs, administration, and community arts services.",
  },
  {
    id: "g-acta-living-cultures",
    name: "Living Cultures Grant",
    funder: "Alliance for California Traditional Arts (ACTA)",
    status: "to_apply",
    fundingResult: "pending",
    potentialAmount: 10000,
    dueDate: "2026-04-27",
    focus:
      "The Alliance for California Traditional Arts Living Cultures Grant supports traditional artists and cultural organizations in preserving, strengthening, and sharing cultural traditions through community-based projects.",
    notes:
      "Living Cultures Grant\n" +
      "https://actaonline.org/programs/living-cultures/\n\n" +
      "Application Deadline: April 27, 2026\n" +
      "Grant Request Amount: $7,500 (individuals) / $10,000 (organizations)\n" +
      "Grant Activity Period: September 1, 2026 – August 31, 2027\n" +
      "Estimated Arrival of Funds: August 2026\n\n" +
      "The Alliance for California Traditional Arts Living Cultures Grant supports traditional artists and cultural organizations in preserving, strengthening, and sharing cultural traditions through community-based projects.",
  },
];
