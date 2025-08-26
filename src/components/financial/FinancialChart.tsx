"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Square } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const FinancialChart = () => {
  return (
    <Card className="h-fit w-full py-3 rounded-md flex justify-between gap-3">
      <CardHeader className="font-medium text-lg px-4 gap-0 pb-0 h-fit">
        <div className=" flex flex-wrap items-center gap-1 justify-between">
          <h3 className="text-base">Financial Transaction</h3>
          <div className="text-sm font-normal flex gap-3">
            <div className="space-x-1">
              <Square className="h-4 w-4 inline fill-primary" />
              <span>Income</span>
            </div>
            <div className="space-x-1">
              <Square className="h-4 w-4 inline fill-secondary-green text-secondary-green" />
              <span>Expense</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 flex flex-col items-center justify-center">
        <Separator className="-mt-1" />
        <ChartContainer className="h-[250px] " config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-primary)" radius={4} />
            <Bar
              dataKey="mobile"
              fill="var(--color-secondary-green)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
