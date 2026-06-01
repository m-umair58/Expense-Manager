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
      <div className="text-center py-8 text-slate-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className={`flex items-center justify-between py-4 px-1 group ${
            showActiveToggle && expense.isActive === false ? "opacity-50" : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-900 truncate">{expense.title}</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {expense.category}
              </span>
            </div>
            {expense.notes && (
              <p className="text-sm text-slate-500 mt-0.5 truncate">{expense.notes}</p>
            )}
            {showDate && expense.date && (
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatCurrency(expense.amount)}
            </span>
            {showActiveToggle && onToggleActive && (
              <button
                onClick={() => onToggleActive(expense._id, !expense.isActive)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  expense.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {expense.isActive ? "Active" : "Inactive"}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(expense._id)}
                className="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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
              className="text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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
      ))}
    </div>
  );
}
