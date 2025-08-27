import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionsTabel from "@/components/financial/TransactionsTable";
import prisma from "@/lib/prisma";
import FinancialChart from "@/components/financial/FinancialChart";
import RevenueTarget from "@/components/financial/RevenueTarget";
import { getFinancialSummary } from "@/lib/financial";

async function FinancialsPage() {
  const [transactions, summary] = await Promise.all([
    prisma.transaction.findMany({
      take: 5,
      select: {
        id: true,
        category: true,
        amount: true,
        createdAt: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    getFinancialSummary(),
  ]);

  const transactionsData = transactions.map((transaction) => ({
    id: transaction.id,
    category: transaction.category,
    amount: Number(transaction.amount),
    createdAt: transaction.createdAt,
  }));

  const revenueTargets = await prisma.revenueTarget.findMany({
    take: 3,
  });

  const revenueTargetsData = revenueTargets.map((target) => ({
    id: target.id,
    name: target.name,
    untilDate: target.untilDate,
    totalTarget: Number(target.totalTarget),
  }));

  return (
    <div className="px-4 sm:ps-7 flex flex-col lg:flex-row gap-4 lg:gap-0">
      {/* left */}
      <div className="pt-4 lg:border-r lg:border-r-border w-full lg:pr-3">
        <HeaderPage
          title="Financial Reports"
          desc="Detailed overview of your financials situation."
        />
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
        <RevenueTarget data={revenueTargetsData} />
        <div className="bg-primary-gray rounded-md w-[230px] p-3 flex flex-col justify-between">
          <div className="">
            <h3 className="font-medium text-base leading-snug">
              Financial Details
            </h3>
            <p className="mt-2 leading-tight text-[13px] text-muted-foreground">
              See your financial details to get a overview of your income and
              expenses.
            </p>
          </div>
          <Link href="/financials/details">
            <Button
              className="mt-6 w-full bg-secondary-green"
              variant="secondary"
            >
              Details Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FinancialsPage;
