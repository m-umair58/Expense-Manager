import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BaselineExpense from "@/models/BaselineExpense";

type RouteContext = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, amount, category, notes, isActive } = body;

    const expense = await BaselineExpense.findByIdAndUpdate(
      params.id,
      {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(category !== undefined && { category }),
        ...(notes !== undefined && { notes }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("PUT /api/baseline/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update baseline expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const expense = await BaselineExpense.findByIdAndDelete(params.id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE /api/baseline/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete baseline expense" },
      { status: 500 }
    );
  }
}
