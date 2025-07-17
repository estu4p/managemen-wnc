"use client";
import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, CircleAlert, Square } from "lucide-react";
import Link from "next/link";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

const page = () => {
  return (
    <div className="px-4 sm:ps-7 flex flex-col lg:flex-row gap-4 lg:gap-0">
      {/* left */}
      <div className="pt-4 lg:border-r lg:border-r-border w-full lg:pr-3">
        <HeaderPage
          title="Financial Report"
          desc="Detailed overview of your financial situation."
        />
        <div className="flex gap-3 flex-wrap">
          <FinancialCard
            title="Total Balance"
            value="132,000,000"
            statistic="-25"
          />
          <FinancialCard title="Income" value="32,000,000" statistic="12" />
          <FinancialCard title="Expanse" value="2,000,0000" statistic="-30" />
        </div>
        {/*  */}
        <div className="mt-3 flex gap-3 flex-col lg:flex-row">
          <Card className="min-w-[290px] py-3 rounded-md flex gap-3">
            <CardHeader className="font-medium text-lg px-4 gap-0 leading-tight pb-0">
              <div className=" flex items-center gap-1 justify-between">
                <h3 className="text-base">Financial Transaction</h3>
              </div>
            </CardHeader>
            <CardContent className="px-4 space-y-2 relative">
              <Separator
                orientation="vertical"
                className="absolute top-0 left-10"
              />
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 ">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      {/* <Avatar>
                      <AvatarFallback className="bg-primary-green text-white">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar> */}
                      <div className="-space-y-1">
                        <h5 className="font-medium">Order</h5>
                        <span className="text-muted-foreground text-[13px]">
                          12 Jan 2025
                        </span>
                      </div>
                    </div>
                    <span className="">Rp. 45,000</span>
                  </div>
                  <Separator className="my-0" />
                </div>
              ))}
            </CardContent>
          </Card>
          {/*  */}
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
                    <span>Expanses</span>
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
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-primary)"
                    radius={4}
                  />
                  <Bar
                    dataKey="mobile"
                    fill="var(--color-secondary-green)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* right */}
      <div className="lg:pt-4 lg:px-3 flex max-[504px]:flex-col lg:flex-col gap-3">
        <Card className="w-[230px] max-h-fit flex-1 py-3 rounded-md flex gap-0 border-primary">
          <CardHeader className="font-medium text-base px-4 gap-0 leading-tight pb-0">
            <div className="flex items-center gap-1">
              <CircleAlert className="text-red-600 h-4 w-4" />
              <h3>Revenue Target</h3>
            </div>
          </CardHeader>
          <CardContent className="px-3 mt-3 gap-0 space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border rounded-md p-2 border-primary">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Monthly Target</span>
                  <span className="">Rp. 4,000,000</span>
                </div>
                <p className="text-muted-foreground text-[13px]">
                  Until 30 January
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
        <div className="bg-primary-gray rounded-md w-[230px] p-3 flex flex-col justify-between">
          <div className="">
            <h3 className="font-medium text-base leading-snug">
              Financial Details
            </h3>
            <p className="mt-2 leading-tight text-[13px] text-muted-foreground">
              See your financial details to get a overview of your income and
              expenses.
            </p>
          </div>
          <Link href="/financial/details">
            <Button
              className="mt-6 w-full bg-secondary-green"
              variant="secondary"
            >
              Details Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
