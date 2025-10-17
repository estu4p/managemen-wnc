"use client";

import { UpdateProgress } from "@/components/form/UpdateProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoveUpRight } from "lucide-react";
import Link from "next/link";

export type Invoice = {
  id: string;
  photo: string | null;
  name: string;
  totalPayment: number;
  progress: string;
  date: Date;
  items: any;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      const photo = row.original.photo;

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            {photo && <AvatarImage src={photo} />}
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Invoice ID",
  },
  {
    accessorKey: "totalPayment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-primary-gray -ml-4"
        >
          Total Payment
          <ArrowUpDown className="ml-0.5 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalPayment = row.original.totalPayment;
      return formatRupiah(totalPayment);
    },
    // sorting lebih spesifik
    sortingFn: (rowA, rowB, columnId) => {
      const totalPaymentA = rowA.getValue(columnId) as number;
      const totalPaymentB = rowB.getValue(columnId) as number;
      return totalPaymentA > totalPaymentB
        ? 1
        : totalPaymentA < totalPaymentB
        ? -1
        : 0;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-primary-gray"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    // Sorting timestamp
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId) as string);
      const dateB = new Date(rowB.getValue(columnId) as string);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "status",
    header: "Status & Items",
    cell: ({ row }) => {
      const invoice = row.original;
      const progress = invoice.progress;
      const items = invoice.items;
      const id = invoice.id;

      return <UpdateProgress id={id} progress={progress} items={items} />;
    },
  },
  {
    accessorKey: "details",
    header: () => <div className="text-right">Details</div>,
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <div className="text-right">
          <Button size="iconXs" className="">
            <Link href={`/invoices/${id}`}>
              <MoveUpRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
