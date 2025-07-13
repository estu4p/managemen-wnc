"use client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MoveUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const InvoiceData = [
  {
    name: "Reza Pramudya",
    id: "WNC-250539",
    totalPayment: "Rp. 240,000",
    date: "June 01, 2023",
    time: "12:30 PM",
    status: "newOrder",
  },
  {
    name: "Ridwan Hidayat",
    id: "WNC-250540",
    totalPayment: "Rp. 40,000",
    date: "June 01, 2023",
    time: "19:10 PM",
    status: "waitting",
  },
  {
    name: "Fathur Rahman",
    id: "WNC-250541",
    totalPayment: "Rp. 120,000",
    date: "June 01, 2023",
    time: "10:30 AM",
    status: "onProgress",
  },
  {
    name: "Asep Maulana",
    id: "WNC-250542",
    totalPayment: "Rp. 80,000",
    date: "June 01, 2023",
    time: "15:45 PM",
    status: "readyPickUp",
  },
  {
    name: "Dewi Lestari",
    id: "WNC-250543",
    totalPayment: "Rp. 60,000",
    date: "June 01, 2023",
    time: "11:20 AM",
    status: "newOrder",
  },
  {
    name: "Budi Santoso",
    id: "WNC-250544",
    totalPayment: "Rp. 100,000",
    date: "June 01, 2023",
    time: "14:00 PM",
    status: "waitting",
  },
];

const statusLabels = {
  newOrder: "New Order",
  waitting: "Waiting",
  onProgress: "On Progress",
  readyPickUp: "Ready for Pick Up",
};

const OrderList = () => {
  return (
    <div className="container mx-auto">
      <div className=" rounded-md border h-fit">
        <Table>
          <TableHeader className="bg-primary-gray">
            <TableRow>
              <TableHead className="text-primary">Invoice Name</TableHead>
              <TableHead className="text-primary">Invoice ID</TableHead>
              <TableHead className="text-primary">Total Payment</TableHead>
              <TableHead className="text-primary">Date & Time</TableHead>
              <TableHead className="text-primary">Status</TableHead>
              <TableHead className="w-[0px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {InvoiceData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {/* <div className=""> */}
                  <Avatar className="size-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ES</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{item.name}</span>
                  {/* </div> */}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.totalPayment}</TableCell>
                <TableCell>
                  {item.date}
                  <span className="text-muted-foreground">
                    {" "}
                    - {item.time}
                  </span>{" "}
                </TableCell>
                <TableCell>
                  <Badge variant={item.status as any}>
                    {statusLabels[item.status as keyof typeof statusLabels] ||
                      item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right w-fit">
                  <Button
                    size="iconXs"
                    variant="outline"
                    className="border-none"
                  >
                    {/* <Link href={`/order/details/${item.id}`}> */}
                    <Link href={`/order/details`}>
                      <MoveUpRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          //   onClick={() => table.previousPage()}
          //   disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          //   onClick={() => table.nextPage()}
          //   disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderList;
