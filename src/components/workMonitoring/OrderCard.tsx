import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { Badge } from "../ui/badge";

const statusLabels = {
  NEW_ORDER: "New Order",
  WAITTING: "Waiting",
  ON_PROGRESS: "On Progress",
  PICKER_UP: "Ready for Pick Up", //PICK_UP
};

type Invoices = {
  id: string;
  name: string;
  totalPayment: number;
  date: Date;
  items: { name: string; service: string; status: string }[];
  notes: string;
};

const OrderCard = ({ data }: { data: Invoices[] }) => {
  const limitedData = data.slice(0, 6);
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 max-[650px]:justify-center w-full lg:px-9">
      {limitedData.map((invoice, index) => (
        <Card
          key={index}
          className="w-[290px] flex flex-col justify-between h-[411px] rounded-md"
        >
          <CardHeader className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
              <div className="">
                <CardTitle>{invoice.name}</CardTitle>
                <CardDescription className="text-[13px]">
                  12:30 PM
                </CardDescription>
              </div>
            </div>
            <Badge variant={invoice.items[0].status as any}>
              {statusLabels[
                invoice.items[0].status as keyof typeof statusLabels
              ] || invoice.items[0].status}
            </Badge>
          </CardHeader>
          <CardContent className="">
            <div className="flex items-center justify-between w-[94%]">
              <div>
                <h3 className="font-medium text-muted-foreground">Order ID</h3>
                <span className="font-medium">{invoice.id}</span>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">
                  Total Payment
                </h3>
                <span className="font-medium">
                  {formatRupiah(invoice.totalPayment)}
                </span>
              </div>
            </div>
            {/*  */}
            <div className="mt-5 space-y-2">
              {invoice.items.slice(0, 2).map((item, idx) => (
                <div className="flex items-center gap-2" key={idx}>
                  <Avatar className="size-9">
                    <AvatarImage />
                    <AvatarFallback>HL</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium capitalize">{item.name}</h3>
                    <p className="text-muted-foreground -mt-1">
                      {item.service}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex items-end justify-end p-0">
              <Button
                className="text-muted-foreground hover:bg-background p-0"
                variant="ghost"
                size="noPadding"
              >
                +2 more items
              </Button>
            </div>
            <div className="mt-4 px">
              <span className="font-medium text-muted-foreground">
                Order Notes
              </span>
              {invoice.notes ? (
                <p className="text-wrap leading-tight">{invoice.notes}</p>
              ) : (
                "-"
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/invoice/${invoice.id}`} className="w-full">
              <Button className="bg-primary-green w-full">Order details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default OrderCard;
