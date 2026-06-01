import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { computeMonthStats } from "@/lib/stats";
import BaselineExpense from "@/models/BaselineExpense";
import MonthlyExpense from "@/models/MonthlyExpense";
import { Summary } from "@/types/expense";

export const dynamic = "force-dynamic";

async function buildSummary(month: number, year: number): Promise<Summary> {
  const [baselineExpenses, monthlyExpenses] = await Promise.all([
    BaselineExpense.find({ isActive: true }),
    MonthlyExpense.find({ month, year }),
  ]);

  const baselineTotal = baselineExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown: Record<string, number> = {};

  for (const expense of baselineExpenses) {
    categoryBreakdown[expense.category] =
      (categoryBreakdown[expense.category] || 0) + expense.amount;
  }

  for (const expense of monthlyExpenses) {
    categoryBreakdown[expense.category] =
      (categoryBreakdown[expense.category] || 0) + expense.amount;
  }

  return {
    month,
    year,
    baselineTotal,
    monthlyTotal,
    grandTotal: baselineTotal + monthlyTotal,
    baselineCount: baselineExpenses.length,
    monthlyCount: monthlyExpenses.length,
    categoryBreakdown,
  };
}

function getPrevMonthYear(month: number, year: number) {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));
    const includeComparison = searchParams.get("compare") === "true";

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

    const summary = await buildSummary(month, year);

    if (!includeComparison) {
      return NextResponse.json(summary, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const prev = getPrevMonthYear(month, year);
    const prevSummary = await buildSummary(prev.month, prev.year);
    const stats = computeMonthStats(summary, prevSummary);

    return NextResponse.json(
      {
        ...summary,
        previousMonth: prevSummary,
        stats,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("GET /api/summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
