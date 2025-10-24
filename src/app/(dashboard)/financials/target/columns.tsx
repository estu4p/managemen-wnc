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
  totalBalance: number;
  progress: number;
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
    cell: ({ row }) => {
      const title = row.original.title;
      return <h5 className="capitalize">{title}</h5>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const catogory = row.original.category;
      return <h5 className="lowercase first-letter:uppercase">{catogory}</h5>;
    },
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
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const target = row.original;
      return (
        <div className="flex gap-2">
          <span>{formatRupiah(target.totalBalance)}</span>
          {/* <Progress value={target.progress} className="mt-1.5 h-1.5" /> */}
          <span>({Math.round(target.progress)}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => {
      const fromDate = row.original.fromDate;
      const category = row.original.category;
      return (
        <span>
          {category === "DAILY" || category === "MONTHLY"
            ? "-"
            : formatDate(fromDate)}
        </span>
      );
    },
  },
  {
    accessorKey: "untilDate",
    header: "Until Date",
    cell: ({ row }) => {
      const untilDate = row.original.untilDate;
      const category = row.original.category;
      return (
        <span>
          {category === "DAILY" || category === "MONTHLY"
            ? "-"
            : formatDate(untilDate)}
        </span>
      );
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
