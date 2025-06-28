"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";

export type CustomerRecord = {
  id: string;
  photo: string;
  name: string;
  phone: string;
  totalNotes: number;
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
    accessorKey: "totalNotes",
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
        <Button size="iconXs">
          <MoveUpRight />
        </Button>
      );
    },
  },
];
