import { SortOption } from "@/components/SearchFilter";

interface FilterableExpense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string;
  date?: string;
  createdAt?: string;
}

export function filterAndSortExpenses<T extends FilterableExpense>(
  expenses: T[],
  search: string,
  category: string,
  sort: SortOption
): T[] {
  let result = [...expenses];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q))
    );
  }

  if (category) {
    result = result.filter((e) => e.category === category);
  }

  result.sort((a, b) => {
    switch (sort) {
      case "amount-desc":
        return b.amount - a.amount;
      case "amount-asc":
        return a.amount - b.amount;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "date-asc": {
        const da = a.date || a.createdAt || "";
        const db = b.date || b.createdAt || "";
        return da.localeCompare(db);
      }
      case "date-desc":
      default: {
        const da = a.date || a.createdAt || "";
        const db = b.date || b.createdAt || "";
        return db.localeCompare(da);
      }
    }
  });

  return result;
}
