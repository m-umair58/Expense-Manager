import { Summary } from "@/types/expense";

export interface MonthStats {
  daysInMonth: number;
  daysElapsed: number;
  isCurrentMonth: boolean;
  dailyAverage: number;
  momChangePercent: number | null;
  momChangeAmount: number | null;
  prevGrandTotal: number | null;
  categoryPercentages: Record<string, number>;
}

export function computeMonthStats(
  summary: Summary,
  prevSummary: Summary | null,
  now: Date = new Date()
): MonthStats {
  const daysInMonth = new Date(summary.year, summary.month, 0).getDate();
  const isCurrentMonth =
    summary.month === now.getMonth() + 1 && summary.year === now.getFullYear();
  const daysElapsed = isCurrentMonth ? now.getDate() : daysInMonth;
  const dailyAverage = daysElapsed > 0 ? summary.grandTotal / daysElapsed : 0;

  let momChangePercent: number | null = null;
  let momChangeAmount: number | null = null;
  let prevGrandTotal: number | null = null;

  if (prevSummary) {
    prevGrandTotal = prevSummary.grandTotal;
    momChangeAmount = summary.grandTotal - prevSummary.grandTotal;

    if (prevSummary.grandTotal > 0) {
      momChangePercent = (momChangeAmount / prevSummary.grandTotal) * 100;
    } else if (summary.grandTotal > 0) {
      momChangePercent = 100;
    } else {
      momChangePercent = 0;
    }
  }

  const categoryPercentages: Record<string, number> = {};
  for (const [category, amount] of Object.entries(summary.categoryBreakdown)) {
    categoryPercentages[category] =
      summary.grandTotal > 0 ? (amount / summary.grandTotal) * 100 : 0;
  }

  return {
    daysInMonth,
    daysElapsed,
    isCurrentMonth,
    dailyAverage,
    momChangePercent,
    momChangeAmount,
    prevGrandTotal,
    categoryPercentages,
  };
}

export function formatPercent(value: number, decimals = 1): string {
  return `${Math.abs(value).toFixed(decimals)}%`;
}

export function formatMomLabel(
  momChangePercent: number | null,
  momChangeAmount: number | null,
  prevMonth: number,
  prevYear: number
): string {
  if (momChangePercent === null || momChangeAmount === null) {
    return "No prior month data";
  }

  const prevMonthName = new Date(2000, prevMonth - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
  const pctSign = momChangePercent > 0 ? "+" : momChangePercent < 0 ? "−" : "";

  if (momChangeAmount === 0) {
    return `Same as ${prevMonthName} ${prevYear}`;
  }

  return `${pctSign}${formatPercent(momChangePercent)} vs ${prevMonthName} ${prevYear}`;
}

export function computeBudgetUsage(spent: number, budget: number) {
  const usedPercent = budget > 0 ? (spent / budget) * 100 : 0;
  const barPercent = budget > 0 ? Math.min(usedPercent, 100) : 0;
  const remaining = budget - spent;
  const isOver = remaining < 0;

  return { usedPercent, barPercent, remaining, isOver };
}
