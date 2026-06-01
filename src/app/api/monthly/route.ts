import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MonthlyExpense from "@/models/MonthlyExpense";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const filter: { month?: number; year?: number } = {};
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const expenses = await MonthlyExpense.find(filter).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/monthly error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, amount, category, month, year, notes, date } = body;

    if (!title || amount === undefined || !category || !month || !year) {
      return NextResponse.json(
        { error: "Title, amount, category, month, and year are required" },
        { status: 400 }
      );
    }

    const expense = await MonthlyExpense.create({
      title,
      amount: Number(amount),
      category,
      month: Number(month),
      year: Number(year),
      notes,
      date: date ? new Date(date) : undefined,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("POST /api/monthly error:", error);
    return NextResponse.json(
      { error: "Failed to create monthly expense" },
      { status: 500 }
    );
  }
}
