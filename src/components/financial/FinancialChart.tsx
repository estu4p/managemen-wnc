"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Square, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

type FinancialChartProps = {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
};

const chartConfig = {
  income: { label: "Income", color: "#2563eb" },
  expense: { label: "Expense", color: "#60a5fa" },
} satisfies ChartConfig;

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(0);

  const maxPage = Math.ceil(data.length / ITEMS_PER_PAGE) - 1;

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleData = data.slice(startIndex, endIndex);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, maxPage));

  return (
    <Card className="h-fit w-full py-3 rounded-md flex flex-col gap-3">
      <CardHeader className="font-medium text-lg px-4 pb-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
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
      <Separator className="-mt-1 mb-2" />
      <CardContent className="px-4 flex flex-col items-center justify-center relative">
        {/*  */}
        <div className="absolute right-0 top-1/2 -translate-y-12 w-full flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={`px-0.5 py-1 rounded-md border text-sm transition-colors ${
              page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-muted"
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={page === maxPage}
            className={`px-0.5 py-1 rounded-md border text-sm transition-colors ${
              page === maxPage
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-muted"
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        {/*  */}

        <ChartContainer className="h-[250px]" config={chartConfig}>
          <BarChart accessibilityLayer data={visibleData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="var(--color-primary)" radius={4} />
            <Bar
              dataKey="expense"
              fill="var(--color-secondary-green)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>

        {/* Indikator halaman */}
        <div className="mt-2 text-xs text-muted-foreground">
          Showing {startIndex + 1}–{Math.min(endIndex, data.length)} of{" "}
          {data.length} months
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
