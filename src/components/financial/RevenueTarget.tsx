import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChevronRight, CircleAlert } from "lucide-react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { formatDate, formatRupiah } from "@/lib/format";

type Targets = {
  id: number;
  category: string;
  untilDate: Date;
  totalTarget: number;
};

const RevenueTarget = ({ data }: { data: Targets[] }) => {
  return (
    <Card className="w-[230px] max-h-fit flex-1 py-3 rounded-md flex gap-0 border-primary">
      <CardHeader className="font-medium text-base px-4 gap-0 leading-tight pb-0">
        <div className="flex items-center gap-1">
          <CircleAlert className="text-red-600 h-4 w-4" />
          <h3>Revenue Target</h3>
        </div>
      </CardHeader>
      <CardContent className="px-3 mt-3 gap-0 space-y-2">
        {data.map((target, index) => (
          <div key={index} className="border rounded-md p-2 border-primary">
            <div className="flex items-center justify-between">
              <span className="font-medium">{target.category}</span>
              <span className="">{formatRupiah(target.totalTarget)}</span>
            </div>
            <p className="text-muted-foreground text-[13px]">
              Until {formatDate(target.untilDate)}
            </p>
            <Progress value={64} className="mt-1.5 h-1.5" />
          </div>
        ))}
        <div className="flex items-center justify-end">
          <Link
            href="/financial/target/"
            className="text-[13px] text-muted-foreground"
          >
            Manage
            <ChevronRight className="h-4 w-4 ml-0.5 inline" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTarget;
