"use client";

import { formatCurrency, getMonthName } from "@/lib/utils";
import { Summary } from "@/types/expense";

interface SummaryCardsProps {
  summary: Summary | null;
  loading: boolean;
}

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
            <div className="h-8 bg-slate-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      label: "Baseline (Recurring)",
      value: summary.baselineTotal,
      sub: `${summary.baselineCount} expense${summary.baselineCount !== 1 ? "s" : ""}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: `${getMonthName(summary.month)} Specific`,
      value: summary.monthlyTotal,
      sub: `${summary.monthlyCount} expense${summary.monthlyCount !== 1 ? "s" : ""}`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total This Month",
      value: summary.grandTotal,
      sub: `${getMonthName(summary.month)} ${summary.year}`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {Object.keys(summary.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">By Category</h3>
          <div className="space-y-3">
            {Object.entries(summary.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const pct = summary.grandTotal > 0 ? (amount / summary.grandTotal) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{category}</span>
                      <span className="font-medium text-slate-900 tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
