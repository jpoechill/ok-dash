"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { budgetCategories, expenseItems } from "@/lib/admin-mock-data";

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<"expenses" | "remaining">("expenses");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(expenseItems.map((item) => item.category)))],
    [],
  );

  const filteredExpenses = useMemo(
    () =>
      expenseItems.filter((item) => (categoryFilter === "All" ? true : item.category === categoryFilter)),
    [categoryFilter],
  );

  const totalSpent = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = filteredExpenses
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const remainingByCategory = useMemo(
    () =>
      budgetCategories.map((category) => {
        const remaining = Math.max(0, category.planned - category.spent);
        const usedPercent = Math.min(100, Math.round((category.spent / category.planned) * 100));
        return {
          ...category,
          remaining,
          usedPercent,
        };
      }),
    [],
  );
  const totalRemaining = remainingByCategory.reduce((sum, category) => sum + category.remaining, 0);
  const totalBudgetPlanned = budgetCategories.reduce((sum, category) => sum + category.planned, 0);
  const totalBudgetSpent = budgetCategories.reduce((sum, category) => sum + category.spent, 0);
  const pendingFromAllExpenses = expenseItems
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);
  const availableAfterPending = Math.max(0, totalBudgetPlanned - totalBudgetSpent - pendingFromAllExpenses);

  return (
    <AppShell
      title="Expenses"
      subtitle="Track spending for this season with quick filters and status visibility."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Items</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{filteredExpenses.length}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total Spent</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">${totalSpent.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-900">${pendingAmount.toLocaleString()}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Remaining Balance</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            ${availableAfterPending.toLocaleString()}
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              activeTab === "expenses"
                ? "border-amber-300 bg-amber-100 text-amber-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:text-amber-900"
            }`}
          >
            Expense log
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("remaining")}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              activeTab === "remaining"
                ? "border-amber-300 bg-amber-100 text-amber-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:text-amber-900"
            }`}
          >
            Remaining budget
          </button>
        </div>

        {activeTab === "expenses" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">Expense log</h2>
              <label className="text-sm text-zinc-600">
                Category{" "}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="ml-2 rounded-lg border border-zinc-200 px-2 py-1"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Vendor</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((item) => (
                    <tr key={item.id} className="border-t border-zinc-100">
                      <td className="py-2">{item.date}</td>
                      <td className="py-2">{item.category}</td>
                      <td className="py-2">{item.vendor}</td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            item.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 text-right font-medium text-zinc-900">
                        ${item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-900">Remaining budget</h2>
              <p className="text-sm text-zinc-600">
                Remaining total: <span className="font-medium text-zinc-900">${totalRemaining.toLocaleString()}</span>
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {remainingByCategory.map((category) => (
                <li
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  <p className="text-zinc-600">
                    Planned ${category.planned.toLocaleString()} • Spent ${category.spent.toLocaleString()} •{" "}
                    <span className="font-medium text-amber-900">
                      Remaining ${category.remaining.toLocaleString()}
                    </span>
                  </p>
                  <div className="w-full">
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-amber-600"
                        style={{ width: `${category.usedPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{category.usedPercent}% used</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </AppShell>
  );
}
