"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { computeBudgetUsage } from "@/lib/stats";

interface BudgetBarProps {
  month: number;
  year: number;
  spent: number;
}

function budgetKey(month: number, year: number) {
  return `expense-budget-${year}-${month}`;
}

export default function BudgetBar({ month, year, spent }: BudgetBarProps) {
  const [budget, setBudget] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(budgetKey(month, year));
    if (stored) {
      setBudget(Number(stored));
    } else {
      setBudget(null);
    }
    setEditing(false);
  }, [month, year]);

  const saveBudget = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      localStorage.removeItem(budgetKey(month, year));
      setBudget(null);
    } else {
      localStorage.setItem(budgetKey(month, year), String(value));
      setBudget(value);
    }
    setEditing(false);
  };

  const clearBudget = () => {
    localStorage.removeItem(budgetKey(month, year));
    setBudget(null);
    setEditing(false);
  };

  if (!budget && !editing) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Monthly Budget</p>
            <p className="text-xs text-slate-400 mt-0.5">Set a spending limit to track progress</p>
          </div>
          <button
            onClick={() => {
              setInputValue("");
              setEditing(true);
            }}
            className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
          >
            Set Budget
          </button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-indigo-200">
        <p className="text-sm font-medium text-slate-700 mb-3">Set monthly budget (Rs)</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            min="0"
            step="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 50000"
            autoFocus
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={saveBudget}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { usedPercent, barPercent, remaining, isOver } = computeBudgetUsage(spent, budget!);
  const barColor =
    usedPercent >= 100 ? "bg-red-500" : usedPercent >= 80 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Monthly Budget</p>
          <p className="text-xs text-slate-400">
            {formatCurrency(spent)} of {formatCurrency(budget!)} spent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold tabular-nums ${isOver ? "text-red-600" : "text-emerald-600"}`}
          >
            {isOver ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
          </span>
          <button
            onClick={() => {
              setInputValue(String(budget));
              setEditing(true);
            }}
            className="text-xs text-slate-400 hover:text-indigo-600 px-2 py-1"
            aria-label="Edit budget"
          >
            Edit
          </button>
          <button
            onClick={clearBudget}
            className="text-xs text-slate-400 hover:text-red-600 px-2 py-1"
            aria-label="Clear budget"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${barPercent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">
        {usedPercent.toFixed(1)}% of budget used
        {isOver && ` (${formatCurrency(spent)} spent vs ${formatCurrency(budget!)} budget)`}
      </p>
    </div>
  );
}
