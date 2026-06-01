"use client";

import { useCallback, useEffect, useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import MonthSelector from "@/components/MonthSelector";
import SummaryCards from "@/components/SummaryCards";
import { getCurrentMonthYear } from "@/lib/utils";
import {
  BaselineExpense,
  ExpenseFormData,
  MonthlyExpense,
  Summary,
} from "@/types/expense";

export default function Dashboard() {
  const [month, setMonth] = useState(getCurrentMonthYear().month);
  const [year, setYear] = useState(getCurrentMonthYear().year);
  const [baselineExpenses, setBaselineExpenses] = useState<BaselineExpense[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"baseline" | "monthly">("baseline");
  const [showBaselineForm, setShowBaselineForm] = useState(false);
  const [showMonthlyForm, setShowMonthlyForm] = useState(false);
  const [editingBaseline, setEditingBaseline] = useState<BaselineExpense | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [baselineRes, monthlyRes, summaryRes] = await Promise.all([
        fetch("/api/baseline"),
        fetch(`/api/monthly?month=${month}&year=${year}`),
        fetch(`/api/summary?month=${month}&year=${year}`),
      ]);

      if (baselineRes.ok) setBaselineExpenses(await baselineRes.json());
      if (monthlyRes.ok) setMonthlyExpenses(await monthlyRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleAddBaseline = async (data: ExpenseFormData) => {
    const res = await fetch("/api/baseline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowBaselineForm(false);
      fetchData();
    }
  };

  const handleEditBaseline = async (data: ExpenseFormData) => {
    if (!editingBaseline) return;
    const res = await fetch(`/api/baseline/${editingBaseline._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingBaseline(null);
      fetchData();
    }
  };

  const handleStartEditBaseline = (id: string) => {
    const expense = baselineExpenses.find((e) => e._id === id);
    if (expense) {
      setEditingBaseline(expense);
      setShowBaselineForm(false);
    }
  };

  const handleAddMonthly = async (data: ExpenseFormData) => {
    const res = await fetch("/api/monthly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, month, year }),
    });
    if (res.ok) {
      setShowMonthlyForm(false);
      fetchData();
    }
  };

  const handleDeleteBaseline = async (id: string) => {
    if (!confirm("Delete this baseline expense?")) return;
    await fetch(`/api/baseline/${id}`, { method: "DELETE" });
    if (editingBaseline?._id === id) setEditingBaseline(null);
    fetchData();
  };

  const handleDeleteMonthly = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await fetch(`/api/monthly/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/baseline/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    fetchData();
  };

  const activeBaseline = baselineExpenses.filter((e) => e.isActive);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expense Manager</h1>
            <p className="text-sm text-slate-500">Track baseline & monthly expenses</p>
          </div>
          <MonthSelector month={month} year={year} onChange={handleMonthChange} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <SummaryCards summary={summary} loading={loading} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("baseline")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "baseline"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Baseline Expenses
              <span className="block text-xs font-normal text-slate-400 mt-0.5">
                Recurring every month
              </span>
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "monthly"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Monthly Expenses
              <span className="block text-xs font-normal text-slate-400 mt-0.5">
                One-time this month
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "baseline" ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Baseline Expenses</h3>
                    <p className="text-sm text-slate-500">
                      Fixed costs that repeat every month (rent, subscriptions, etc.)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBaseline(null);
                      setShowBaselineForm(!showBaselineForm);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {showBaselineForm ? "Cancel" : "+ Add Baseline"}
                  </button>
                </div>

                {editingBaseline && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">
                      Edit Baseline Expense
                    </h4>
                    <ExpenseForm
                      key={editingBaseline._id}
                      initialData={{
                        title: editingBaseline.title,
                        amount: String(editingBaseline.amount),
                        category: editingBaseline.category,
                        notes: editingBaseline.notes || "",
                      }}
                      onSubmit={handleEditBaseline}
                      onCancel={() => setEditingBaseline(null)}
                      submitLabel="Save Changes"
                    />
                  </div>
                )}

                {showBaselineForm && !editingBaseline && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ExpenseForm onSubmit={handleAddBaseline} submitLabel="Add Baseline Expense" />
                  </div>
                )}

                {loading ? (
                  <div className="py-8 text-center text-slate-400">Loading...</div>
                ) : (
                  <ExpenseList
                    expenses={baselineExpenses}
                    onDelete={handleDeleteBaseline}
                    onEdit={handleStartEditBaseline}
                    onToggleActive={handleToggleActive}
                    showActiveToggle
                    emptyMessage="No baseline expenses yet. Add your recurring monthly costs like rent, utilities, or subscriptions."
                  />
                )}

                {activeBaseline.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                    {activeBaseline.length} active baseline expense
                    {activeBaseline.length !== 1 ? "s" : ""} applied to every month
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Monthly Expenses</h3>
                    <p className="text-sm text-slate-500">
                      Expenses specific to this month only
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMonthlyForm(!showMonthlyForm)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {showMonthlyForm ? "Cancel" : "+ Add Expense"}
                  </button>
                </div>

                {showMonthlyForm && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ExpenseForm
                      onSubmit={handleAddMonthly}
                      submitLabel="Add Monthly Expense"
                      showDate
                    />
                  </div>
                )}

                {loading ? (
                  <div className="py-8 text-center text-slate-400">Loading...</div>
                ) : (
                  <ExpenseList
                    expenses={monthlyExpenses}
                    onDelete={handleDeleteMonthly}
                    showDate
                    emptyMessage="No expenses for this month yet. Add one-time purchases, events, or other monthly-specific costs."
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
