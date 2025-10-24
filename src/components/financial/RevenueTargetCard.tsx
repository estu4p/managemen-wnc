import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ChevronRight, CircleAlert } from "lucide-react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { formatDate, formatRupiah } from "@/lib/format";

type Targets = {
  id: number;
  title: string;
  untilDate: Date;
  totalTarget: number;
  totalBalance: number;
  progress: number;
  category: string | null;
};

const RevenueTargetCard = ({ data }: { data: Targets[] }) => {
  return (
    <Card className="w-[230px] max-h-fit flex-1 py-3 rounded-md flex gap-0 border-primary">
      <CardHeader className="font-medium text-base px-4 gap-0 leading-tight pb-0">
        <div className="flex items-center gap-1">
          <CircleAlert className="text-red-600 h-4 w-4" />
          <h3>Revenue Target</h3>
        </div>
      </CardHeader>
      <CardContent className="px-3 mt-2 gap-0 space-y-2">
        {data.map((target, index) => (
          <div key={index} className="border rounded-md p-2 border-primary">
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">{target.title}</span>
              <span className="text-[13px]">
                {formatRupiah(target.totalTarget)}
              </span>
            </div>
            {target.category != "DAILY" && target.category != "MONTHLY" && (
              <p className="text-muted-foreground text-[13px]">
                Until {formatDate(target.untilDate)}
              </p>
            )}

            <div className="flex justify-between text-[13px]">
              <span>{formatRupiah(target.totalBalance)}</span>
              <span>{Math.round(target.progress)}%</span>
            </div>
            <Progress value={target.progress} className="mt-1.5 h-1.5" />
          </div>
        ))}
        <div className="flex items-center justify-end">
          <Link
            href="/financials/target/"
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
export default RevenueTargetCard;
