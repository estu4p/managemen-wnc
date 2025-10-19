"use client";

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
    header: "User Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    // accessorKey: "role",
    header: "Status",
    cell: ({ row }) => {
      const [selectStatus, setSelectStatus] = useState("active");

      return (
        <Popover>
          <PopoverTrigger>
            <Badge variant="default" className="cursor-pointer">
              Active
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="text-sm bg-accent">
            <div className="flex items-center justify-between">
              <h4>Select Status : </h4>
              <div className="flex gap-2">
                <Badge
                  variant={`${selectStatus === "active" ? "green" : "outline"}`}
                  className="cursor-pointer"
                  onClick={() => setSelectStatus("active")}
                >
                  Active
                </Badge>
                <Badge
                  variant={`${
                    selectStatus === "nonActive" ? "green" : "outline"
                  }`}
                  className="cursor-pointer"
                  onClick={() => setSelectStatus("nonActive")}
                >
                  Non-Active
                </Badge>
              </div>
            </div>
            <Separator className="my-2 h-4" />
            <div className="flex items-center justify-between">
              <div className="text-[13px]">
                <span>Status now:</span>
                <span className="text-secondary-green ml-3 underline">
                  {selectStatus}
                </span>
              </div>
              <button className="bg-primary rounded-md text-white px-3 py-0.5 font-medium cursor-pointer">
                Save
              </button>
            </div>
          </PopoverContent>
        </Popover>
      );
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
            <Link href={`/settings/${id}`}>
              <MoveUpRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
