import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBaselineExpense extends Document {
  title: string;
  amount: number;
  category: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BaselineExpenseSchema = new Schema<IBaselineExpense>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BaselineExpense: Model<IBaselineExpense> =
  mongoose.models.BaselineExpense ||
  mongoose.model<IBaselineExpense>("BaselineExpense", BaselineExpenseSchema);

export default BaselineExpense;
