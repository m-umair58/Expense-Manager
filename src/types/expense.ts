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

export interface MonthStats {
  daysInMonth: number;
  daysElapsed: number;
  isCurrentMonth: boolean;
  dailyAverage: number;
  momChangePercent: number | null;
  momChangeAmount: number | null;
  prevGrandTotal: number | null;
  categoryPercentages: Record<string, number>;
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
  previousMonth?: Summary;
  stats?: MonthStats;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  notes: string;
  date?: string;
}
