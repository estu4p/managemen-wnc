"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoveUpRight } from "lucide-react";
import Link from "next/link";

export type Transaction = {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: Date;
};

const typeLabels = {
  INCOME: "Income",
  EXPENSE: "Expense",
};

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title;
      return <span className="font-medium">{title}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant={type as any}>
          {typeLabels[type as keyof typeof typeLabels] || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.original.amount;
      return formatRupiah(amount);
    },
    // sorting lebih spesifik
    sortingFn: (rowA, rowB, columnId) => {
      const amountA = rowA.getValue(columnId) as number;
      const amountB = rowB.getValue(columnId) as number;
      return amountA > amountB ? 1 : amountA < amountB ? -1 : 0;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-primary-gray"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return (
        <>
          {formatDate(date as Date)}
          <span className="text-muted-foreground">
            - {formatTime(date as Date)}
          </span>
        </>
      );
    },
    // Sorting timestamp
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "details",
    header: () => <div className="text-right">Details</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="text-right">
          <Button size="iconXs" className="">
            <Link href={`/financials/transactions/${id}`}>
              <MoveUpRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
