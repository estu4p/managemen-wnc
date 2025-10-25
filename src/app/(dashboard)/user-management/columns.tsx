"use client";

import UpdateStatusUser from "@/components/form/UpdateStatusUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type User = {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "SUPERADMIN";
  status: string;
  createdAt: Date;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "UserName",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    // accessorKey: "role",
    header: "Status",
    cell: ({ row }) => {
      const id = row.original.id;
      const status = row.original.status;

      return <UpdateStatusUser id={id} status={status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const time = row.original.createdAt;
      return formatDate(time as Date);
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
            <Link href={`/user-management/${id}`}>
              <MoveUpRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
