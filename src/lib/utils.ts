export const CATEGORIES = [
  "Housing",
  "Utilities",
  "Food",
  "Transport",
  "Insurance",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Phone",
  "Work Expenses",
  "Subscriptions",
  "Travel",
  "Gifts",
  "Taxes",
  "Miscellaneous",
  "Uncategorized",
  "Automotive",
  "Home Improvement",
  "Personal Care",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(amount);
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", { month: "long" });
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}
