"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export type Inventory = {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
};

export const columns: ColumnDef<Inventory>[] = [
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
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "currentStock",
    header: "Stock",
    cell: ({ row }) => {
      const currentStock = row.getValue("currentStock");
      const unit = row.original.unit;
      return (
        <>
          {currentStock as number} {unit}
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
