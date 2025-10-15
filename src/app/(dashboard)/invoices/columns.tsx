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
    header: "Status & Items",
    cell: ({ row }) => {
      const invoice = row.original;
      const progress = invoice.progress;
      const items = invoice.items;
      const id = invoice.id;

      return <UpdateProgress id={id} progress={progress} items={items} />;
      // return (
      // <div className="flex items-center gap-1">
      //   <Badge variant={progress as any}>
      //     {statusLabels[progress as keyof typeof statusLabels] || progress}
      //   </Badge>
      //   <Popover>
      //     <PopoverTrigger asChild>
      //       <Button variant="outline" size="xxs">
      //         <ChevronDown />
      //       </Button>
      //     </PopoverTrigger>
      //     <PopoverContent className="w-80 md:w-[400px] md:mr-10">
      //       <div className="flex md:justify-between border-b">
      //         <h3 className="text-sm font-semibold md:min-w-30">Name</h3>
      //         <h3 className="text-sm font-semibold md:w-full">Service</h3>
      //         <h3 className="text-sm font-semibold">Status</h3>
      //       </div>
      //       {items.map((item: any, index: number) => (
      //         <div
      //           key={item.id}
      //           className="w-full flex items-center text-[13px] border-b"
      //         >
      //           <h4 className="md:min-w-30 capitalize">{item.name}</h4>
      //           <h4 className="md:w-full">{item.service.join(", ")}</h4>
      //           {/* <h4 className="">{item.status}</h4> */}
      //           <ButtonGroup className="">
      //             <Select
      //               value={selectedProgress}
      //               onValueChange={setSelectedProgress}
      //             >
      //               <SelectTrigger className="border-none p-0">
      //                 {progress !== selectedProgress && (
      //                   <div className="w-2 h-2 bg-blue-300 rounded-full" />
      //                 )}
      //                 <h4 className="text-[13px]">
      //                   {(statusLabels[
      //                     selectedProgress as keyof typeof statusLabels
      //                   ] ||
      //                     progress) ??
      //                     item.status}
      //                 </h4>
      //               </SelectTrigger>
      //               <SelectContent>
      //                 {Object.entries(statusLabels).map(([key, label]) => (
      //                   <SelectItem
      //                     key={key}
      //                     value={key}
      //                     onClick={() => setSelectedProgress(key)}
      //                   >
      //                     <span className="text-muted-foreground text-[13px]">
      //                       {statusLabels[
      //                         label as keyof typeof statusLabels
      //                       ] || label}
      //                     </span>
      //                   </SelectItem>
      //                 ))}
      //               </SelectContent>
      //             </Select>
      //           </ButtonGroup>
      //         </div>
      //       ))}
      //       <div className="w-full mt-2 text-end">
      //         <Button size="sm">Update Status</Button>
      //       </div>
      //     </PopoverContent>
      //   </Popover>
      // </div>
      // );
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
