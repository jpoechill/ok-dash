import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { AuthButtons } from "@/components/auth-buttons";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/teachers", label: "Teachers" },
  { href: "/dances", label: "Dances" },
];

const secondaryNavItems = [
  { href: "/wishlist", label: "Wishlist" },
  { href: "/grants", label: "Grants" },
  { href: "/grant-tools", label: "Grant Tools" },
  { href: "/expenses", label: "Expenses and Budget" },
];

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-amber-50/40 text-zinc-900">
      <header className="border-b border-amber-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-sm font-medium text-amber-800">Pom</p>
                <AuthButtons />
                <label className="text-xs text-zinc-500">
                  <span className="sr-only">Season year</span>
                  <select
                    defaultValue="2026"
                    className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </label>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
            </div>
            <Link
              href="/"
              className="shrink-0 self-start rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
            >
              <Image
                src="/logo.svg"
                alt="Pom"
                width={200}
                height={64}
                className="h-12 w-auto max-w-[200px] object-contain object-left sm:h-14"
                priority
              />
            </Link>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 transition hover:border-amber-300 hover:text-amber-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-wrap gap-2 lg:justify-end">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 transition hover:border-amber-300 hover:text-amber-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
