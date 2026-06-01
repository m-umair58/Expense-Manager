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
    <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-3 w-full sm:w-auto">
      <button
        onClick={goToPrev}
        className="p-2.5 sm:p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-600 touch-manipulation"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="text-center min-w-[120px] sm:min-w-[160px]">
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          <span className="sm:hidden">{getMonthName(month).slice(0, 3)}</span>
          <span className="hidden sm:inline">{getMonthName(month)}</span>
          {" "}{year}
        </h2>
        {!isCurrentMonth && (
          <button
            onClick={goToCurrent}
            className="text-xs text-indigo-600 hover:text-indigo-800 active:text-indigo-900 mt-0.5 touch-manipulation"
          >
            Go to today
          </button>
        )}
      </div>
      <button
        onClick={goToNext}
        className="p-2.5 sm:p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-600 touch-manipulation"
        aria-label="Next month"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
