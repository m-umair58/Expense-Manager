# Expense Manager

A Next.js expense tracking app with MongoDB. Manage **baseline (recurring monthly)** expenses and **month-specific** one-time expenses in one place.

## Features

- **Baseline expenses** — Fixed costs that repeat every month (rent, subscriptions, utilities)
- **Monthly expenses** — One-time or month-specific purchases and costs
- **Month navigation** — Browse and track expenses by month
- **Summary dashboard** — Totals for baseline, monthly, and combined spending
- **Category breakdown** — Visual breakdown by expense category
- **Toggle baseline active/inactive** — Pause recurring expenses without deleting them

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router with API routes)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 2. Install dependencies

```bash
cd expense-manager
npm install
```

### 3. Configure environment

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/expense-manager
```

For MongoDB Atlas, use your connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/expense-manager
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/baseline` | List all baseline expenses |
| POST | `/api/baseline` | Create a baseline expense |
| PUT | `/api/baseline/[id]` | Update a baseline expense |
| DELETE | `/api/baseline/[id]` | Delete a baseline expense |
| GET | `/api/monthly?month=&year=` | List monthly expenses for a month |
| POST | `/api/monthly` | Create a monthly expense |
| PUT | `/api/monthly/[id]` | Update a monthly expense |
| DELETE | `/api/monthly/[id]` | Delete a monthly expense |
| GET | `/api/summary?month=&year=` | Get spending summary for a month |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── baseline/       # Baseline expense CRUD
│   │   ├── monthly/        # Monthly expense CRUD
│   │   └── summary/        # Monthly summary
│   ├── layout.tsx
│   └── page.tsx            # Main dashboard
├── components/
│   ├── ExpenseForm.tsx
│   ├── ExpenseList.tsx
│   ├── MonthSelector.tsx
│   └── SummaryCards.tsx
├── lib/
│   ├── mongodb.ts          # DB connection
│   └── utils.ts
├── models/
│   ├── BaselineExpense.ts
│   └── MonthlyExpense.ts
└── types/
    └── expense.ts
```
