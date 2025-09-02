"use client";

import DiscountForm from "@/components/form/DiscountForm";
import ServiceForm from "@/components/form/ServiceForm";
import { formatDate, formatRupiah } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";

export type Service = {
  id: number;
  name: string;
  price: number;
};

export type Discount = {
  id: number;
  title: string;
  amount: number;
  type: string;
  fromDate: Date;
  untilDate: Date;
};

export const serviceColumns: ColumnDef<Service>[] = [
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
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center md:-ml-8">Price</div>,
    cell: ({ row }) => {
      const price = row.original.price;

      return <div className="text-center">{formatRupiah(price)}</div>;
    },
  },
  {
    id: "action",
    header: () => <div className="text-end">Action</div>,
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="text-right flex gap-1.5 justify-end">
          <ServiceForm
            mode="edit"
            defaultValues={{
              id: service.id,
              name: service.name,
              price: Number(service.price),
            }}
          />
          <ServiceForm
            mode="delete"
            defaultValues={{ id: service.id, name: service.name }}
          />
        </div>
      );
    },
  },
];

export const discountColumns: ColumnDef<Discount>[] = [
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
    accessorKey: "amount",
    header: "Discount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.type;

      return (
        <>
          {type === "PERCENTAGE" ? `${Number(amount)} %` : formatRupiah(amount)}
        </>
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
      const discount = row.original;
      return (
        <div className="text-right flex gap-1.5 justify-end">
          <DiscountForm
            mode="edit"
            defaultValues={{
              title: discount.title,
              amount: Number(discount.amount),
              type: discount.type,
              fromDate: discount.fromDate,
              untilDate: discount.untilDate,
            }}
          />
          <DiscountForm
            mode="delete"
            defaultValues={{ title: discount.title }}
          />
        </div>
      );
    },
  },
];
