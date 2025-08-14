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
import { formatDate, formatRupiah, formatTime } from "@/lib/format";

type Invoices = {
  id: string;
  name: string;
  totalPayment: number;
  date: Date;
  items: { status: string }[];
};

const statusLabels = {
  NEW_ORDER: "New Order",
  WAITTING: "Waiting",
  ON_PROGRESS: "On Progress",
  PICKER_UP: "Ready for Pick Up", //PICK_UP
};

const OrderTable = ({ data }: { data: Invoices[] }) => {
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
            {data.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {/* <div className=""> */}
                  <Avatar className="size-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ES</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{invoice.name}</span>
                  {/* </div> */}
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{formatRupiah(invoice.totalPayment)}</TableCell>
                <TableCell>
                  {formatDate(invoice.date)}
                  <span className="text-muted-foreground">
                    {" "}
                    - {formatTime(invoice.date)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={invoice.items[0].status as any}>
                    {statusLabels[
                      invoice.items[0].status as keyof typeof statusLabels
                    ] || invoice.items[0].status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right w-fit">
                  <Button size="iconXs">
                    <Link href={`/order/details/`}>
                      <MoveUpRight />
                    </Link>
                  </Button>
                  {/* <Button
                    size="iconXs"
                    variant="outline"
                    className="border-none"
                  > */}
                  {/* <Link href={`/order/details/${item.id}`}> */}
                  {/* <Link href={`/order/details`}>
                      <MoveUpRight />
                    </Link>
                  </Button> */}
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

export default OrderTable;
