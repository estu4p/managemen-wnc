"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export type CustomerRecord = {
  id: string;
  photo: string;
  name: string;
  phone: string;
  totalInvoices: number;
  totalItems: number;
  firstTimeComing: string;
};

export const columns: ColumnDef<CustomerRecord>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={customer.photo} />
            <AvatarFallback>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{customer.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalInvoices",
    header: "Total Notes",
  },
  {
    accessorKey: "totalItems",
    header: "Total Items",
  },
  {
    accessorKey: "firstTimeComing",
    header: "First Time Coming",
  },
  {
    id: "action",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <Link href="/customers/details">
          <Button size="iconXs">
            <MoveUpRight />
          </Button>
        </Link>
      );
    },
  },
];
