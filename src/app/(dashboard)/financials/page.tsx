import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionsTabel from "@/components/financial/TransactionsTable";
import prisma from "@/lib/prisma";
import FinancialChart from "@/components/financial/FinancialChart";
import { getFinancialSummary } from "@/lib/financial";
import RevenueTargetCard from "@/components/financial/RevenueTargetCard";
import { MonthPicker } from "@/components/MonthPicker";
import { Plus } from "lucide-react";

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

  const [transactions, summary] = await Promise.all([
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

  const revenueTargetsData = revenueTargets.map((target) => ({
    id: target.id,
    title: target.title,
    untilDate: target.untilDate,
    totalTarget: Number(target.totalTarget),
  }));

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
          <div className="flex gap-3">
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
          <FinancialChart />
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
