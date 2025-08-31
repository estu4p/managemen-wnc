"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export type Transaction = {
  id: number;
  name: string;
  type: string;
  category: string;
  amount: number;
  date: Date;
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="font-medium">{name}</span>;
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
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return formatRupiah(amount);
    },
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = row.getValue("date");
      return (
        <>
          {formatDate(date as Date)}
          <span className="text-muted-foreground">
            - {formatTime(date as Date)}
          </span>
        </>
      );
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
            <Link href={`/inventories/${id}`}>
              <MoveUpRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
