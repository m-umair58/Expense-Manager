import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BaselineExpense from "@/models/BaselineExpense";

export async function GET() {
  try {
    await connectDB();
    const expenses = await BaselineExpense.find().sort({ createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/baseline error:", error);
    return NextResponse.json(
      { error: "Failed to fetch baseline expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, amount, category, notes } = body;

    if (!title || amount === undefined || !category) {
      return NextResponse.json(
        { error: "Title, amount, and category are required" },
        { status: 400 }
      );
    }

    const expense = await BaselineExpense.create({
      title,
      amount: Number(amount),
      category,
      notes,
      isActive: true,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("POST /api/baseline error:", error);
    return NextResponse.json(
      { error: "Failed to create baseline expense" },
      { status: 500 }
    );
  }
}
