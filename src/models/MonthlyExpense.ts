import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMonthlyExpense extends Document {
  title: string;
  amount: number;
  category: string;
  month: number;
  year: number;
  notes?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MonthlyExpenseSchema = new Schema<IMonthlyExpense>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    notes: { type: String, trim: true },
    date: { type: Date },
  },
  { timestamps: true }
);

MonthlyExpenseSchema.index({ month: 1, year: 1 });

const MonthlyExpense: Model<IMonthlyExpense> =
  mongoose.models.MonthlyExpense ||
  mongoose.model<IMonthlyExpense>("MonthlyExpense", MonthlyExpenseSchema);

export default MonthlyExpense;
