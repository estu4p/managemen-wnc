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
import Pagination from "../Pagination";

type Invoices = {
  id: string;
  name: string;
  totalPayment: number;
  progress: string;
  date: Date;
};

const statusLabels = {
  NEW_ORDER: "New Order",
  WAITTING: "Waiting",
  ON_PROGRESS: "On Progress",
  PICKER_UP: "Ready for Pick Up", //PICK_UP
};

const OrderTable = ({
  data,
  page = 1,
  count = 10,
}: {
  data: Invoices[];
  page?: number;
  count?: number;
}) => {
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
                  <Badge variant={invoice.progress as any}>
                    {statusLabels[
                      invoice.progress as keyof typeof statusLabels
                    ] || invoice.progress}
                  </Badge>
                </TableCell>
                <TableCell className="text-right w-fit">
                  <Button size="iconXs">
                    <Link href={`/invoices/${invoice.id}`}>
                      <MoveUpRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} count={count} />
    </div>
  );
};

export default OrderTable;
