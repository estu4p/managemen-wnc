import { DataTable } from "@/components/DataTable";
import FiltersDropdown from "@/components/FiltersDropdown";
import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getFinancialSummary } from "@/lib/financial";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Search } from "lucide-react";
import { columns } from "./columns";
import { MonthPicker } from "@/components/MonthPicker";

const FilterStatusData = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "soap",
    label: "Soap",
  },
  {
    id: "brush",
    label: "Brush",
  },
  {
    id: "cleaningSolution",
    label: "Cleaning Solution",
  },
  {
    id: "cloth",
    label: "Cloth",
  },
  {
    id: "spray",
    label: "Spray",
  },
  {
    id: "accessory",
    label: "Accessory",
  },
  {
    id: "package",
    label: "Package",
  },
];

const typeLabels = {
  INCOME: "Income",
  EXPENSE: "Expense",
};

async function TransactionDetailsPage(params: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await params.searchParams;
  const { page, month, year, queryParams } = searchParams;
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
    date: transaction.createdAt,
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

      <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
        <ToggleGroup
          type="single"
          className="gap-2 rounded-none text-white"
          defaultValue="all"
        >
          <ToggleGroupItem
            value="all"
            className="bg-primary rounded-md w-fit px-4 hover:bg-secondary-green/80 data-[state=on]:bg-secondary-green data-[state=on]:text-black"
            size="sm"
            defaultChecked
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="income"
            className="bg-primary rounded-md w-fit px-4 hover:bg-secondary-green/80 data-[state=on]:bg-secondary-green data-[state=on]:text-black"
            size="sm"
          >
            Income
          </ToggleGroupItem>
          <ToggleGroupItem
            value="expense"
            className="bg-primary rounded-md w-fit px-4 hover:bg-secondary-green/80 data-[state=on]:bg-secondary-green data-[state=on]:text-black"
            size="sm"
          >
            Expense
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex gap-2 items-center max-sm:justify-end max-sm:w-full">
          <div className="relative">
            <Input
              className="text-sm bg-accent"
              placeholder="Search Transaction"
            />
            <Search className=" absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <FiltersDropdown
            filterStatusData={FilterStatusData}
            subTitle="Category"
            className="text-sm"
          />
          <Button size="sm">Export</Button>
        </div>
      </div>
      <div className="container mx-auto mt-3">
        <DataTable columns={columns} data={transactionData} />
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
