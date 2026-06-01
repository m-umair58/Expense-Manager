import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MonthlyExpense from "@/models/MonthlyExpense";

type RouteContext = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, amount, category, month, year, notes, date } = body;

    const expense = await MonthlyExpense.findByIdAndUpdate(
      params.id,
      {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(category !== undefined && { category }),
        ...(month !== undefined && { month: Number(month) }),
        ...(year !== undefined && { year: Number(year) }),
        ...(notes !== undefined && { notes }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("PUT /api/monthly/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update monthly expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const expense = await MonthlyExpense.findByIdAndDelete(params.id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE /api/monthly/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete monthly expense" },
      { status: 500 }
    );
  }
}
