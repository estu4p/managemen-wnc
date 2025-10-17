import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import { getFinancialSummary } from "@/lib/financial";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { MonthPicker } from "@/components/MonthPicker";
import TransactionList from "@/components/financial/TransactionList";

async function TransactionDetailsPage(params: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await params.searchParams;
  const { page, month, year } = searchParams;
  const p = page ? parseInt(page) : 1;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const selectedMonth = month ? parseInt(month) : currentMonth;
  const selectedYear = year ? parseInt(year) : currentYear;

  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

  const [data, count, summary] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.transaction.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    getFinancialSummary(startDate, endDate),
  ]);

  const transactionData = data.map((transaction) => ({
    id: transaction.id,
    title: transaction.title,
    type: transaction.type,
    category: transaction.category,
    amount: Number(transaction.amount),
    createdAt: transaction.createdAt,
  }));

  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-end justify-between w-full">
        <HeaderPage title="Transaction Details" desc="" calendar={false} />

        <div className="flex justify-end mb-4">
          <MonthPicker />
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
      <TransactionList
        transactions={transactionData}
        p={p}
        count={count}
        endDate={endDate}
        startDate={startDate}
      />
    </div>
  );
}

export default TransactionDetailsPage;
