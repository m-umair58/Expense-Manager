import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BaselineExpense from "@/models/BaselineExpense";
import MonthlyExpense from "@/models/MonthlyExpense";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      month,
      year,
      baselineTotal,
      monthlyTotal,
      grandTotal: baselineTotal + monthlyTotal,
      baselineCount: baselineExpenses.length,
      monthlyCount: monthlyExpenses.length,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("GET /api/summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
