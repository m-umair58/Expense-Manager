"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BudgetBar from "@/components/BudgetBar";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import MonthSelector from "@/components/MonthSelector";
import SearchFilter, { SortOption } from "@/components/SearchFilter";
import SummaryCards from "@/components/SummaryCards";
import { filterAndSortExpenses } from "@/lib/filterExpenses";
import { copySummaryText, exportMonthToCSV } from "@/lib/export";
import { getCurrentMonthYear } from "@/lib/utils";
import {
  BaselineExpense,
  ExpenseFormData,
  MonthlyExpense,
  Summary,
} from "@/types/expense";

const fetchOptions: RequestInit = { cache: "no-store" };

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
  const [editingMonthly, setEditingMonthly] = useState<MonthlyExpense | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [copied, setCopied] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [baselineRes, monthlyRes, summaryRes] = await Promise.all([
        fetch("/api/baseline", fetchOptions),
        fetch(`/api/monthly?month=${month}&year=${year}`, fetchOptions),
        fetch(`/api/summary?month=${month}&year=${year}&compare=true`, fetchOptions),
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

  useEffect(() => {
    setSearch("");
    setCategoryFilter("");
  }, [activeTab, month, year]);

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
      setShowFabMenu(false);
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
      setShowFabMenu(false);
      fetchData();
    }
  };

  const handleEditMonthly = async (data: ExpenseFormData) => {
    if (!editingMonthly) return;
    const res = await fetch(`/api/monthly/${editingMonthly._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, month, year }),
    });
    if (res.ok) {
      setEditingMonthly(null);
      fetchData();
    }
  };

  const handleStartEditMonthly = (id: string) => {
    const expense = monthlyExpenses.find((e) => e._id === id);
    if (expense) {
      setEditingMonthly(expense);
      setShowMonthlyForm(false);
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
    if (editingMonthly?._id === id) setEditingMonthly(null);
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

  const handleCopySummary = () => {
    if (!summary) return;
    copySummaryText(summary.month, summary.year, summary.baselineTotal, summary.monthlyTotal, summary.grandTotal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    exportMonthToCSV(month, year, baselineExpenses, monthlyExpenses);
  };

  const filteredBaseline = useMemo(
    () => filterAndSortExpenses(baselineExpenses, search, categoryFilter, sort),
    [baselineExpenses, search, categoryFilter, sort]
  );

  const filteredMonthly = useMemo(
    () => filterAndSortExpenses(monthlyExpenses, search, categoryFilter, sort),
    [monthlyExpenses, search, categoryFilter, sort]
  );

  const activeBaseline = baselineExpenses.filter((e) => e.isActive);

  const openQuickAdd = (tab: "baseline" | "monthly") => {
    setActiveTab(tab);
    setShowFabMenu(false);
    if (tab === "baseline") {
      setEditingBaseline(null);
      setShowBaselineForm(true);
    } else {
      setEditingMonthly(null);
      setShowMonthlyForm(true);
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 sm:pb-8">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 safe-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:block">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Expense Manager</h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  Track baseline &amp; monthly expenses
                </p>
              </div>
              <button
                onClick={handleExport}
                className="sm:hidden p-2 text-slate-500 hover:text-indigo-600 active:text-indigo-700 touch-manipulation"
                aria-label="Export CSV"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
            <MonthSelector month={month} year={year} onChange={handleMonthChange} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-8">
        <SummaryCards
          summary={summary}
          loading={loading}
          onCopySummary={handleCopySummary}
          copied={copied}
        />

        {summary && !loading && <BudgetBar month={month} year={year} spent={summary.grandTotal} />}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("baseline")}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors touch-manipulation ${
                activeTab === "baseline"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              }`}
            >
              Baseline
              <span className="hidden sm:block text-xs font-normal text-slate-400 mt-0.5">
                Recurring every month
              </span>
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors touch-manipulation ${
                activeTab === "monthly"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              }`}
            >
              Monthly
              <span className="hidden sm:block text-xs font-normal text-slate-400 mt-0.5">
                One-time this month
              </span>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "baseline" ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 sm:mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">Baseline Expenses</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Fixed costs that repeat every month
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExport}
                      className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export CSV
                    </button>
                    <button
                      onClick={() => {
                        setEditingBaseline(null);
                        setShowBaselineForm(!showBaselineForm);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation"
                    >
                      {showBaselineForm ? "Cancel" : "+ Add Baseline"}
                    </button>
                  </div>
                </div>

                {editingBaseline && (
                  <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Edit Baseline Expense</h4>
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
                  <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ExpenseForm onSubmit={handleAddBaseline} submitLabel="Add Baseline Expense" />
                  </div>
                )}

                <div className="mb-4">
                  <SearchFilter
                    search={search}
                    category={categoryFilter}
                    sort={sort}
                    onSearchChange={setSearch}
                    onCategoryChange={setCategoryFilter}
                    onSortChange={setSort}
                  />
                </div>

                {loading ? (
                  <div className="py-8 text-center text-slate-400">Loading...</div>
                ) : (
                  <ExpenseList
                    expenses={filteredBaseline}
                    onDelete={handleDeleteBaseline}
                    onEdit={handleStartEditBaseline}
                    onToggleActive={handleToggleActive}
                    showActiveToggle
                    emptyMessage={
                      search || categoryFilter
                        ? "No matching baseline expenses."
                        : "No baseline expenses yet. Add your recurring monthly costs like rent, utilities, or subscriptions."
                    }
                  />
                )}

                {activeBaseline.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
                    {activeBaseline.length} active baseline expense
                    {activeBaseline.length !== 1 ? "s" : ""} applied to every month
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 sm:mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">Monthly Expenses</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Expenses specific to this month only</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingMonthly(null);
                      setShowMonthlyForm(!showMonthlyForm);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation"
                  >
                    {showMonthlyForm ? "Cancel" : "+ Add Expense"}
                  </button>
                </div>

                {editingMonthly && (
                  <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Edit Monthly Expense</h4>
                    <ExpenseForm
                      key={editingMonthly._id}
                      initialData={{
                        title: editingMonthly.title,
                        amount: String(editingMonthly.amount),
                        category: editingMonthly.category,
                        notes: editingMonthly.notes || "",
                        date: editingMonthly.date
                          ? new Date(editingMonthly.date).toISOString().split("T")[0]
                          : "",
                      }}
                      onSubmit={handleEditMonthly}
                      onCancel={() => setEditingMonthly(null)}
                      submitLabel="Save Changes"
                      showDate
                    />
                  </div>
                )}

                {showMonthlyForm && !editingMonthly && (
                  <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ExpenseForm onSubmit={handleAddMonthly} submitLabel="Add Monthly Expense" showDate />
                  </div>
                )}

                <div className="mb-4">
                  <SearchFilter
                    search={search}
                    category={categoryFilter}
                    sort={sort}
                    onSearchChange={setSearch}
                    onCategoryChange={setCategoryFilter}
                    onSortChange={setSort}
                  />
                </div>

                {loading ? (
                  <div className="py-8 text-center text-slate-400">Loading...</div>
                ) : (
                  <ExpenseList
                    expenses={filteredMonthly}
                    onDelete={handleDeleteMonthly}
                    onEdit={handleStartEditMonthly}
                    showDate
                    emptyMessage={
                      search || categoryFilter
                        ? "No matching expenses for this month."
                        : "No expenses for this month yet. Add one-time purchases, events, or other monthly-specific costs."
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-4 sm:hidden z-30 safe-bottom">
        {showFabMenu && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-2 items-end mb-2">
            <button
              onClick={() => openQuickAdd("monthly")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-full shadow-lg border border-slate-200 touch-manipulation"
            >
              Monthly expense
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-lg">+</span>
            </button>
            <button
              onClick={() => openQuickAdd("baseline")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-full shadow-lg border border-slate-200 touch-manipulation"
            >
              Baseline expense
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg">+</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all touch-manipulation ${
            showFabMenu
              ? "bg-slate-700 text-white rotate-45"
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
          }`}
          aria-label={showFabMenu ? "Close menu" : "Quick add expense"}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showFabMenu && (
        <div
          className="fixed inset-0 bg-black/20 z-20 sm:hidden"
          onClick={() => setShowFabMenu(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
