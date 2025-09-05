"use client";

import DialogDelete from "@/components/form/DialogDelete";
import DiscountForm from "@/components/form/DiscountForm";
import RevenueTargetForm from "@/components/form/RevenueTargetForm";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatRupiah } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Timer, XCircle } from "lucide-react";

export type RevenueTarget = {
  id: number;
  title: string;
  category: string | null;
  fromDate: Date;
  untilDate: Date;
  totalTarget: number;
  status: string;
};

export const Columns: ColumnDef<RevenueTarget>[] = [
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
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "totalTarget",
    header: "Total Target",
    cell: ({ row }) => {
      const totalTarget = row.original.totalTarget;

      return formatRupiah(totalTarget);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2 py-1 w-[100px]">
          <Progress value={80} className="h-1.5 flex-1" />
          {status === "PROCESS" && (
            <Timer className="text-secondary-green w-5 h-5" />
          )}
          {status === "SUCCESS" && (
            <CheckCircle className="text-green-500 w-5 h-5" />
          )}
          {status === "FAILED" && <XCircle className="text-red-500 w-5 h-5" />}
        </div>
      );
    },
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => {
      const fromDate = row.original.fromDate;
      return formatDate(fromDate);
    },
  },
  {
    accessorKey: "untilDate",
    header: "Until Date",
    cell: ({ row }) => {
      const untilDate = row.original.untilDate;
      return formatDate(untilDate);
    },
  },
  {
    id: "action",
    header: () => <div className="text-end">Action</div>,
    cell: ({ row }) => {
      const target = row.original;
      return (
        <div className="text-right flex gap-1.5 justify-end">
          <RevenueTargetForm
            mode="edit"
            defaultValues={{
              id: target.id,
              title: target.title,
              category: target.category,
              totalTarget: Number(target.totalTarget),
              fromDate: target.fromDate,
              untilDate: target.untilDate,
              status: target.status,
            }}
          />
          <DialogDelete table="target" title={target.title} id={target.id} />
        </div>
      );
    },
  },
];
