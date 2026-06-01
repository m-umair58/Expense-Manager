export interface BaselineExpense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyExpense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  month: number;
  year: number;
  notes?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  month: number;
  year: number;
  baselineTotal: number;
  monthlyTotal: number;
  grandTotal: number;
  baselineCount: number;
  monthlyCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  notes: string;
  date?: string;
}
