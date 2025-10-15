"use client";

import { UpdateProgress } from "@/components/form/UpdateProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateProgress } from "@/lib/action";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { Select } from "@radix-ui/react-select";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

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
    header: "Total Payment",
    cell: ({ row }) => {
      const payment = row.original.totalPayment;
      return <>{formatRupiah(payment) || "Rp -"}</>;
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
