"use client";

import { getMonthName } from "@/lib/utils";

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  const goToPrev = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const goToNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  const goToCurrent = () => {
    const now = new Date();
    onChange(now.getMonth() + 1, now.getFullYear());
  };

  const isCurrentMonth =
    month === new Date().getMonth() + 1 && year === new Date().getFullYear();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={goToPrev}
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="text-center min-w-[160px]">
        <h2 className="text-xl font-bold text-slate-900">
          {getMonthName(month)} {year}
        </h2>
        {!isCurrentMonth && (
          <button
            onClick={goToCurrent}
            className="text-xs text-indigo-600 hover:text-indigo-800 mt-0.5"
          >
            Go to current month
          </button>
        )}
      </div>
      <button
        onClick={goToNext}
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
        aria-label="Next month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
