import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GrantToolsCopyButton } from "@/components/grant-tools-copy-button";
import {
  additionalNotes,
  assetsInvestments,
  boilerplate,
  budgetRows,
  budgetTotal,
  challenges,
  communityNeed,
  coreProgramParagraph,
  donationsInKind,
  equity,
  funderLinks,
  impactStats,
  knyExpenseCategories,
  knyFinancial,
  lookingAhead,
  majorEventImpact,
  mission,
  operationalHighlights,
  orgSnapshot,
  otherImpact,
  programsCulturalEd,
  programsPerformances,
  programsWeekly,
  programHighlights,
  shortDescription,
  typicalGrantRequest,
  useOfFundsParagraph,
  vision,
  workSamplePlaceholders,
} from "@/lib/grant-tools-content";

function Ph({ children }: { children: string }) {
  const isPlaceholder = children.startsWith("[");
  return (
    <span className={isPlaceholder ? "italic text-zinc-500" : undefined}>{children}</span>
  );
}

function CopyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 px-3 py-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{title}</h4>
        <GrantToolsCopyButton text={text} />
      </div>
      <p className="whitespace-pre-wrap px-3 py-3 text-sm leading-relaxed text-zinc-800">{text}</p>
    </div>
  );
}

const jumpLinks = [
  { href: "#organization", label: "Organization" },
  { href: "#programs", label: "Programs" },
  { href: "#need-impact", label: "Need & impact" },
  { href: "#budget", label: "Budget & funds" },
  { href: "#work-samples", label: "Work samples" },
  { href: "#highlights", label: "Highlights & outlook" },
  { href: "#boilerplate", label: "Boilerplate bank" },
  { href: "#funders", label: "Funder portals" },
] as const;

export default function GrantToolsPage() {
  return (
    <AppShell
      title="Grant Tools"
      subtitle="Reference copy, numbers, and boilerplate for Oakland Khmer Angkor Dance Troupe—use with your pipeline on Grants."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            <Link
              href="/grants"
              className="font-medium text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
            >
              Back to Grants
            </Link>
            <span className="text-zinc-400"> · </span>
            Jump to a section below or copy boilerplate when filling applications.
          </p>
        </div>

        <nav
          aria-label="On this page"
          className="sticky top-0 z-30 flex flex-wrap gap-2 rounded-xl border border-amber-200/80 bg-amber-50/95 px-3 py-3 shadow-sm backdrop-blur-sm"
        >
          {jumpLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-amber-200/80 bg-white px-3 py-1 text-xs font-medium text-amber-950 shadow-sm transition hover:border-amber-400 hover:bg-amber-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section id="organization" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Organization snapshot</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Name</dt>
              <dd className="mt-0.5 text-sm text-zinc-900">{orgSnapshot.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Location</dt>
              <dd className="mt-0.5 text-sm text-zinc-900">{orgSnapshot.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Founded</dt>
              <dd className="mt-0.5 text-sm">
                <Ph>{orgSnapshot.foundedYear}</Ph>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Nonprofit / fiscal sponsor
              </dt>
              <dd className="mt-0.5 text-sm text-zinc-800">{orgSnapshot.nonprofitStatus}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Website</dt>
              <dd className="mt-0.5 text-sm">
                <a
                  href={orgSnapshot.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
                >
                  {orgSnapshot.website}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Instagram</dt>
              <dd className="mt-0.5 text-sm">
                <a
                  href={orgSnapshot.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
                >
                  @oakkhmerangkor
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
              <dd className="mt-0.5 text-sm">
                <a href={`mailto:${orgSnapshot.email}`} className="text-zinc-900 underline-offset-2 hover:underline">
                  {orgSnapshot.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Phone</dt>
              <dd className="mt-0.5 text-sm">
                <Ph>{orgSnapshot.phone}</Ph>
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Short description</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{shortDescription}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{mission}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{vision}</p>
            </div>
          </div>
        </section>

        <section id="programs" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Programs overview</h2>

          <div className="space-y-4">
            <article className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">{programsWeekly.title}</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-700">
                <li>
                  <span className="font-medium text-zinc-600">Audience: </span>
                  {programsWeekly.audience}
                </li>
                <li>
                  <span className="font-medium text-zinc-600">Frequency: </span>
                  {programsWeekly.frequency}
                </li>
                <li>
                  <span className="font-medium text-zinc-600">What is taught: </span>
                  {programsWeekly.taught}
                </li>
              </ul>
            </article>

            <article className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">{programsPerformances.title}</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-700">
                <li>
                  <span className="font-medium text-zinc-600">Types of events: </span>
                  {programsPerformances.types}
                </li>
                <li>
                  <span className="font-medium text-zinc-600">Frequency: </span>
                  {programsPerformances.frequency}
                </li>
                <li>
                  <span className="font-medium text-zinc-600">Audience reached: </span>
                  {programsPerformances.audience}
                </li>
              </ul>
            </article>

            <article className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">{programsCulturalEd.title}</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-700">
                <li>
                  <span className="font-medium text-zinc-600">Topics: </span>
                  {programsCulturalEd.topics}
                </li>
                <li>
                  <span className="font-medium text-zinc-600">Delivery: </span>
                  {programsCulturalEd.delivery}
                </li>
              </ul>
            </article>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-800">Core program paragraph (reusable)</h3>
              <GrantToolsCopyButton text={coreProgramParagraph} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{coreProgramParagraph}</p>
          </div>
        </section>

        <section id="need-impact" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Community need, impact & equity</h2>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Community need</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{communityNeed}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Impact at a glance</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {impactStats.map((row) => (
                <li
                  key={row.label}
                  className="rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2 text-sm"
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-zinc-900">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
            <h3 className="text-sm font-semibold text-zinc-900">Major event impact</h3>
            <p className="mt-1 text-sm font-medium text-zinc-800">{majorEventImpact.title}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
              <li>{majorEventImpact.attendees}</li>
              <li>{majorEventImpact.program}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Other impact metrics</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{otherImpact}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Equity & cultural importance</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{equity}</p>
          </div>
        </section>

        <section id="budget" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Budget, typical ask & use of funds</h2>

          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <tr>
                  <th className="px-3 py-2">Line item</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.map((row) => (
                  <tr key={row.line} className="border-t border-zinc-100">
                    <td className="px-3 py-2 text-zinc-800">{row.line}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-900">{row.amount}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-200 bg-zinc-50/80 font-semibold">
                  <td className="px-3 py-2 text-zinc-900">Total annual budget</td>
                  <td className="px-3 py-2 text-right tabular-nums text-zinc-900">{budgetTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Event financial example (Khmer New Year)</h3>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-zinc-500">Total expenses</dt>
                <dd className="font-medium text-zinc-900">{knyFinancial.totalExpenses}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Primary grant funding</dt>
                <dd className="font-medium text-zinc-900">{knyFinancial.primaryGrant}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Additional funds</dt>
                <dd className="text-zinc-800">{knyFinancial.additional}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Ending balance</dt>
                <dd className="font-medium text-zinc-900">{knyFinancial.endingBalance}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Major expense categories
            </p>
            <ul className="mt-1 space-y-1 text-sm text-zinc-700">
              {knyExpenseCategories.map((row) => (
                <li key={row.line}>
                  <span className="text-zinc-600">{row.line}: </span>
                  <span className="tabular-nums text-zinc-900">{row.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Typical grant request</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{typicalGrantRequest}</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-800">Use of funds (reusable paragraph)</h3>
              <GrantToolsCopyButton text={useOfFundsParagraph} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{useOfFundsParagraph}</p>
          </div>
        </section>

        <section id="work-samples" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Work samples & links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-medium text-zinc-700">Website: </span>
              <a
                href={orgSnapshot.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-900 underline decoration-amber-300 underline-offset-2 hover:text-amber-800"
              >
                {orgSnapshot.website}
              </a>
            </li>
            {workSamplePlaceholders.map((row) => (
              <li key={row.label}>
                <span className="font-medium text-zinc-700">{row.label}: </span>
                <Ph>{row.value}</Ph>
              </li>
            ))}
          </ul>
        </section>

        <section id="highlights" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Highlights, assets, challenges & looking ahead</h2>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Program highlights</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
                {programHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Operational highlights</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
                {operationalHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Donations & in-kind</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
                {donationsInKind.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">Assets & investments</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
                {assetsInvestments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Challenges</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
              {challenges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Looking ahead</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
              {lookingAhead.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="boilerplate" className="scroll-mt-32 space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Boilerplate answers bank</h2>
          <p className="text-sm text-zinc-600">
            Copy blocks match common application prompts. Adjust wording to fit character limits.
          </p>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">About your organization</p>
            <CopyBlock title="Short (~50 words)" text={boilerplate.orgShort} />
            <CopyBlock title="Medium (~150 words)" text={boilerplate.orgMedium} />
            <CopyBlock title="Long (~300 words)" text={boilerplate.orgLong} />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Describe your program</p>
            <CopyBlock title="Short (~50 words)" text={boilerplate.programShort} />
            <CopyBlock title="Medium (~150 words)" text={boilerplate.programMedium} />
            <CopyBlock title="Long (~300 words)" text={boilerplate.programLong} />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Impact & use of funds</p>
            <CopyBlock title="What impact do you have?" text={boilerplate.impact} />
            <CopyBlock title="How will funds be used?" text={boilerplate.howFundsUsed} />
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Additional notes (funder positioning)</h2>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-zinc-700">
            {additionalNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="funders" className="scroll-mt-32 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Funder portals & research</h2>
          <p className="mt-1 text-sm text-zinc-600">
            External sites open in a new tab. Cross-check deadlines and eligibility on each funder site.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {funderLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm transition hover:border-amber-300 hover:bg-amber-50/50"
                >
                  <span className="font-medium text-zinc-900">{item.title}</span>
                  <span className="mt-1 block text-xs text-zinc-600">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
