"use client";

import { formatCurrency, getMonthName } from "@/lib/utils";
import { formatMomLabel } from "@/lib/stats";
import { Summary } from "@/types/expense";

interface SummaryCardsProps {
  summary: Summary | null;
  loading: boolean;
  onCopySummary?: () => void;
  copied?: boolean;
}

export default function SummaryCards({
  summary,
  loading,
  onCopySummary,
  copied,
}: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 animate-pulse"
          >
            <div className="h-3 sm:h-4 bg-slate-200 rounded w-20 sm:w-24 mb-2 sm:mb-3" />
            <div className="h-6 sm:h-8 bg-slate-200 rounded w-24 sm:w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const stats = summary.stats;
  const prev = summary.previousMonth;
  const dailyAvg = stats?.dailyAverage ?? 0;
  const daysElapsed = stats?.daysElapsed ?? 0;
  const daysInMonth = stats?.daysInMonth ?? 0;
  const isCurrentMonth = stats?.isCurrentMonth ?? false;
  const momChangePercent = stats?.momChangePercent ?? null;
  const momChangeAmount = stats?.momChangeAmount ?? null;
  const categoryPercentages = stats?.categoryPercentages ?? {};

  const prevMonth = prev
    ? prev.month
    : summary.month === 1
      ? 12
      : summary.month - 1;
  const prevYear = prev
    ? prev.year
    : summary.month === 1
      ? summary.year - 1
      : summary.year;

  const momLabel =
    momChangePercent !== null && momChangeAmount !== null
      ? formatMomLabel(momChangePercent, momChangeAmount, prevMonth, prevYear)
      : "Loading comparison…";

  const cards = [
    {
      label: "Baseline",
      value: summary.baselineTotal,
      sub: `${summary.baselineCount} recurring`,
      color: "text-blue-600",
    },
    {
      label: `${getMonthName(summary.month).slice(0, 3)} Specific`,
      value: summary.monthlyTotal,
      sub: `${summary.monthlyCount} one-time`,
      color: "text-purple-600",
    },
    {
      label: "Total",
      value: summary.grandTotal,
      sub: momLabel,
      color: "text-indigo-600",
      momChangePercent,
    },
    {
      label: "Daily Avg",
      value: dailyAvg,
      sub: isCurrentMonth
        ? `${formatCurrency(dailyAvg)}/day · ${daysElapsed} days elapsed`
        : `${formatCurrency(dailyAvg)}/day · ${daysInMonth} days`,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Overview
        </h2>
        {onCopySummary && (
          <button
            onClick={onCopySummary}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 touch-manipulation"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy summary
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200"
          >
            <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">{card.label}</p>
            <p className={`text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 tabular-nums ${card.color}`}>
              {formatCurrency(card.value)}
            </p>
            <p
              className={`text-xs mt-0.5 sm:mt-1 line-clamp-2 ${
                card.momChangePercent !== undefined && card.momChangePercent !== null
                  ? card.momChangePercent > 0
                    ? "text-red-500"
                    : card.momChangePercent < 0
                      ? "text-emerald-500"
                      : "text-slate-400"
                  : "text-slate-400"
              }`}
              title={card.sub}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {Object.keys(summary.categoryBreakdown).length > 0 && (
        <details className="bg-white rounded-xl shadow-sm border border-slate-200 group">
          <summary className="p-4 sm:p-5 cursor-pointer list-none flex items-center justify-between touch-manipulation">
            <h3 className="text-sm font-semibold text-slate-700">By Category</h3>
            <svg
              className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 pt-4">
            {Object.entries(summary.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const pct =
                  categoryPercentages[category] ??
                  (summary.grandTotal > 0 ? (amount / summary.grandTotal) * 100 : 0);
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1 gap-2">
                      <span className="text-slate-600 truncate">{category}</span>
                      <span className="font-medium text-slate-900 tabular-nums shrink-0 text-right">
                        {formatCurrency(amount)}
                        <span className="text-slate-400 font-normal ml-1">
                          ({pct.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </details>
      )}
    </div>
  );
}
