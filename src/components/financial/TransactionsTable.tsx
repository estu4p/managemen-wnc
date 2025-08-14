"use client";

import { formatDate, formatRupiah } from "@/lib/format";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

type Transactions = {
  id: number;
  category: string;
  amount: number;
  createdAt: Date;
};

const TransactionsTable = ({ data }: { data: Transactions[] }) => {
  return (
    <Card className="min-w-[290px] py-3 rounded-md flex gap-3">
      <CardHeader className="font-medium text-lg px-4 gap-0 leading-tight pb-0">
        <div className=" flex items-center gap-1 justify-between">
          <h3 className="text-base">Financial Transaction</h3>
        </div>
      </CardHeader>
      <CardContent className="px-4 space-y-2 relative">
        <Separator orientation="vertical" className="absolute top-0 left-10" />
        {data.map((transaction, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 ">
                  <span className="font-medium">{index + 1}</span>
                </div>
                <div className="-space-y-1">
                  <h5 className="font-medium">{transaction.category}</h5>
                  <span className="text-muted-foreground text-[13px]">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>
              </div>
              <span className="">{formatRupiah(transaction.amount)}</span>
            </div>
            <Separator className="my-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
