import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionsTabel from "@/components/financial/TransactionsTable";
import prisma from "@/lib/prisma";
import FinancialChart from "@/components/financial/FinancialChart";
import {
  getFinancialSummary,
  getMonthlyFinancialSummary,
} from "@/lib/financial";
import { MonthPicker } from "@/components/MonthPicker";
import { Plus } from "lucide-react";
import { endOfDay, startOfDay, startOfMonth } from "date-fns";
import RevenueTargetCard from "@/components/financial/RevenueTargetCard";

async function FinancialsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;

  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();

  const selectedMonth = params.month ? parseInt(params.month) : currentMonth;
  const selectedYear = params.year ? parseInt(params.year) : currentYear;

  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

  const [transactions, summary, monthlySummary] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        amount: true,
        createdAt: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    getFinancialSummary(startDate, endDate),
    getMonthlyFinancialSummary(selectedYear),
  ]);

  const transactionsData = transactions.map((transaction) => ({
    id: transaction.id,
    title: transaction.title,
    amount: Number(transaction.amount),
    createdAt: transaction.createdAt,
    type: transaction.type,
  }));

  const revenueTargets = await prisma.revenueTarget.findMany({
    take: 3,
  });

  const today = new Date();
  const revenueTargetsData = await Promise.all(
    revenueTargets.map(async (target) => {
      let fromDate = target.fromDate;
      let untilDate = target.untilDate;

      // Sesuaikan periode berdasarkan category
      if (target.category === "DAILY") {
        fromDate = startOfDay(today);
        untilDate = endOfDay(today);
      } else if (target.category === "MONTHLY") {
        fromDate = startOfMonth(today);
        untilDate = endOfDay(today); // sampai hari ini, bukan endOfMonth
      }

      const income = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: "INCOME",
          createdAt: {
            gte: fromDate,
            lte: untilDate,
          },
        },
      });

      const expense = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: "EXPENSE",
          createdAt: {
            gte: fromDate,
            lte: untilDate,
          },
        },
      });

      const totalIncome = Number(income._sum.amount ?? 0);
      const totalExpense = Number(expense._sum.amount ?? 0);
      const totalBalance = totalIncome - totalExpense;

      const progress = Math.min(
        (totalBalance / Number(target.totalTarget)) * 100,
        100
      );

      return {
        id: target.id,
        title: target.title,
        untilDate: target.untilDate,
        totalTarget: Number(target.totalTarget),
        totalBalance,
        progress,
        category: target.category,
      };
    })
  );

  return (
    <div className="px-4 sm:ps-7 flex flex-col lg:flex-row gap-4 lg:gap-0">
      {/* left */}
      <div className="pt-4 lg:border-r lg:border-r-border w-full lg:pr-3">
        <div className="flex items-end justify-between w-full">
          <HeaderPage
            title="Financial Reports"
            desc="Detailed overview of your financials situation."
            calendar={false}
          />
          <div className="flex flex-col lg:flex-row gap-3">
            <Button size="sm" className="hover:bg-transparent hover:text-black">
              <Plus />
              <Link href="/financials/transactions/new">Add Transaction</Link>
            </Button>
            <div className="mb-3">
              <MonthPicker />
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <FinancialCard
            title="Total Balance"
            amount={summary.totalBalance}
            statistic="-25"
          />
          <FinancialCard
            title="Income"
            amount={summary.totalIncome}
            statistic="12"
          />
          <FinancialCard
            title="Expense"
            amount={summary.totalExpense}
            statistic="-30"
          />
        </div>
        <div className="mt-3 flex gap-3 flex-col lg:flex-row">
          <TransactionsTabel data={transactionsData} />
          <FinancialChart data={monthlySummary} />
        </div>
      </div>
      {/* right */}
      <div className="lg:pt-4 lg:px-3 flex max-[504px]:flex-col lg:flex-col gap-3">
        <RevenueTargetCard data={revenueTargetsData} />
        <div className="bg-primary-gray rounded-md w-[230px] p-3 flex flex-col justify-between">
          <div className="">
            <h3 className="font-medium text-base leading-snug">
              Financial Transaction Details
            </h3>
            <p className="mt-2 leading-tight text-[13px] text-muted-foreground">
              View your financial transaction details to get an overview of your
              income and expenses.
            </p>
          </div>
          <Link href="/financials/transactions/">
            <Button
              className="mt-6 w-full bg-secondary-green"
              variant="secondary"
            >
              View Transactions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FinancialsPage;
