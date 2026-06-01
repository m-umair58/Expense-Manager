"use client";

import { useRef } from "react";
import { CATEGORIES } from "@/lib/utils";
import { ExpenseFormData } from "@/types/expense";

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: ExpenseFormData;
  submitLabel?: string;
  showDate?: boolean;
  onCancel?: () => void;
}

const emptyForm: ExpenseFormData = {
  title: "",
  amount: "",
  category: "Other",
  notes: "",
  date: "",
};

export default function ExpenseForm({
  onSubmit,
  initialData,
  submitLabel = "Add Expense",
  showDate = false,
  onCancel,
}: ExpenseFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data: ExpenseFormData = {
      title: formData.get("title") as string,
      amount: formData.get("amount") as string,
      category: formData.get("category") as string,
      notes: (formData.get("notes") as string) || "",
      date: showDate ? (formData.get("date") as string) || "" : undefined,
    };
    await onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  const defaults = initialData ?? emptyForm;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={defaults.title}
            placeholder="e.g. Rent, Netflix, Groceries"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
            Amount (Rs)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaults.amount}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaults.category}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {showDate && (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
              Date (optional)
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={defaults.date}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Notes (optional)
        </label>
        <input
          id="notes"
          name="notes"
          type="text"
          defaultValue={defaults.notes}
          placeholder="Any additional details"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-slate-600 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
