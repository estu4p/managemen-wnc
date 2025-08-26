import FiltersDropdown from "@/components/FiltersDropdown";
import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import Pagination from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFinancialSummary } from "@/lib/financial";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { MoveUpRight, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

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

const InventoryData = [
  {
    id: "detoxy",
    product: "Detoxy",
    category: "Soap",
    stock: "5 L",
  },
  {
    id: "sikatSuede",
    product: "Sikat Suede",
    category: "Brush",
    stock: "5 Pcs",
  },
  {
    id: "premiumCleaner",
    product: "Premium Cleaner",
    category: "Cleaning Solution",
    stock: "10 L",
  },
  {
    id: "mikrofiberTowel",
    product: "Mikrofiber Towel",
    category: "Cloth",
    stock: "20 Pcs",
  },
  {
    id: "cupSoleBrush",
    product: "Cup Sole Brush",
    category: "Brush",
    stock: "7 Pcs",
  },
  {
    id: "deodorizerSpray",
    product: "Deodorizer Spray",
    category: "Spray",
    stock: "12 Bottles",
  },
  {
    id: "shoeTree",
    product: "Shoe Tree",
    category: "Accessory",
    stock: "10 Pairs",
  },
  {
    id: "essentialKitBox",
    product: "Essential Kit Box",
    category: "Package",
    stock: "5 Boxes",
  },
];

const typeLabels = {
  INCOME: "Income",
  EXPENSE: "Expense",
};

async function FinancialDetailsPage(params: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await params.searchParams;
  const { page, queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const [data, count, summary] = await Promise.all([
    prisma.transaction.findMany({
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.transaction.count(),
    getFinancialSummary(),
  ]);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage title="Financial Details" desc="" />
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
        <div className="flex gap-1 items-center max-sm:justify-end max-sm:w-full">
          <Button size="sm">All</Button>
          <Button size="sm">Income</Button>
          <Button size="sm">Expense</Button>
        </div>
        <div className="flex gap-3 items-center max-sm:justify-end max-sm:w-full">
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
        <div className=" rounded-md border h-fit">
          <Table>
            <TableHeader className="bg-primary-gray">
              <TableRow>
                <TableHead className="text-primary">Transaction Name</TableHead>
                <TableHead className="text-primary">Type</TableHead>
                <TableHead className="text-primary">Category</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Date</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type as any}>
                      {typeLabels[
                        transaction.type as keyof typeof typeLabels
                      ] || transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    {formatRupiah(Number(transaction.amount))}
                  </TableCell>
                  <TableCell>
                    {formatDate(transaction.createdAt)}
                    <span className="text-muted-foreground">
                      {" "}
                      - {formatTime(transaction.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="iconXs">
                      <Link href={`/inventory/${transaction.id}`}>
                        <MoveUpRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}

export default FinancialDetailsPage;
