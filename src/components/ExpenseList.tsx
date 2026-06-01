"use client";

import { formatCurrency } from "@/lib/utils";

interface ExpenseItem {
  _id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  date?: string;
  isActive?: boolean;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  emptyMessage?: string;
  showDate?: boolean;
  showActiveToggle?: boolean;
}

export default function ExpenseList({
  expenses,
  onDelete,
  onEdit,
  onToggleActive,
  emptyMessage = "No expenses yet.",
  showDate = false,
  showActiveToggle = false,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 px-4 text-slate-500">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-slate-100">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className={`sm:flex sm:items-center sm:justify-between sm:py-4 sm:px-1 group rounded-lg border border-slate-100 sm:border-0 p-3 sm:p-0 bg-slate-50/50 sm:bg-transparent ${
            showActiveToggle && expense.isActive === false ? "opacity-50" : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-slate-900">{expense.title}</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {expense.category}
              </span>
            </div>
            {expense.notes && (
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{expense.notes}</p>
            )}
            {showDate && expense.date && (
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 mt-3 sm:mt-0 sm:ml-4 sm:gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
            <span className="font-semibold text-slate-900 tabular-nums text-lg sm:text-base">
              {formatCurrency(expense.amount)}
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              {showActiveToggle && onToggleActive && (
                <button
                  onClick={() => onToggleActive(expense._id, !expense.isActive)}
                  className={`text-xs px-2.5 py-1.5 rounded-md transition-colors touch-manipulation ${
                    expense.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                  }`}
                >
                  {expense.isActive ? "Active" : "Inactive"}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(expense._id)}
                  className="p-2 text-slate-400 hover:text-indigo-600 active:text-indigo-700 transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 touch-manipulation"
                  aria-label={`Edit ${expense.title}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onDelete(expense._id)}
                className="p-2 text-slate-400 hover:text-red-600 active:text-red-700 transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 touch-manipulation"
                aria-label={`Delete ${expense.title}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
