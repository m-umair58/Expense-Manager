import { formatCurrency } from "@/lib/utils";
import { BaselineExpense, MonthlyExpense } from "@/types/expense";

export function exportMonthToCSV(
  month: number,
  year: number,
  baselineExpenses: BaselineExpense[],
  monthlyExpenses: MonthlyExpense[]
) {
  const activeBaseline = baselineExpenses.filter((e) => e.isActive);
  const rows: string[][] = [
    ["Type", "Title", "Category", "Amount (PKR)", "Notes", "Date"],
  ];

  for (const e of activeBaseline) {
    rows.push(["Baseline", e.title, e.category, String(e.amount), e.notes || "", "Recurring"]);
  }

  for (const e of monthlyExpenses) {
    rows.push([
      "Monthly",
      e.title,
      e.category,
      String(e.amount),
      e.notes || "",
      e.date ? new Date(e.date).toLocaleDateString() : "",
    ]);
  }

  const baselineTotal = activeBaseline.reduce((s, e) => s + e.amount, 0);
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);
  rows.push([]);
  rows.push(["", "", "Baseline Total", String(baselineTotal), "", ""]);
  rows.push(["", "", "Monthly Total", String(monthlyTotal), "", ""]);
  rows.push(["", "", "Grand Total", String(baselineTotal + monthlyTotal), "", ""]);

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${year}-${String(month).padStart(2, "0")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function copySummaryText(
  month: number,
  year: number,
  baselineTotal: number,
  monthlyTotal: number,
  grandTotal: number
) {
  const monthName = new Date(2000, month - 1, 1).toLocaleString("en-US", { month: "long" });
  const text = [
    `Expense Summary — ${monthName} ${year}`,
    `Baseline: ${formatCurrency(baselineTotal)}`,
    `Monthly: ${formatCurrency(monthlyTotal)}`,
    `Total: ${formatCurrency(grandTotal)}`,
  ].join("\n");

  navigator.clipboard.writeText(text);
}
