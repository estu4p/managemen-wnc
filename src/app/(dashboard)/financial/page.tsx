import FinancialCard from "@/components/financial/FinancialCard";
import HeaderPage from "@/components/HeaderPage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, CircleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionsTabel from "@/components/financial/TransactionsTable";
import prisma from "@/lib/prisma";
import FinancialChart from "@/components/financial/FinancialChart";

async function Financial() {
  const transactions = await prisma.transaction.findMany({
    take: 5,
  });

  const transactionsData = transactions.map((t) => ({
    id: t.id,
    category: t.category,
    amount: Number(t.amount),
    createdAt: t.createdAt,
  }));

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
          {/* Financial Transactions Table */}
          <TransactionsTabel data={transactionsData} />
          {/* Financial Transactions Charts */}
          <FinancialChart />
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
}

export default Financial;
