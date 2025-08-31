"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export type Invoice = {
  id: string;
  photo: string | null;
  name: string;
  totalPayment: number;
  progress: string;
  date: Date;
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
    header: "Total Payment",
    cell: ({ row }) => {
      const payment = row.original.totalPayment;
      return formatRupiah(payment);
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const progress = row.original.progress;
      const statusLabels = {
        NEW_ORDER: "New Order",
        WAITTING: "Waiting",
        ON_PROGRESS: "On Progress",
        PICKER_UP: "Ready for Pick Up", //PICK_UP
      };

      return (
        <Badge variant={progress as any}>
          {statusLabels[progress as keyof typeof statusLabels] || progress}
        </Badge>
      );
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
