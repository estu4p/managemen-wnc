import { DataTable } from "@/components/DataTable";
import RevenueTargetForm from "@/components/form/RevenueTargetForm";
import HeaderPage from "@/components/HeaderPage";
import prisma from "@/lib/prisma";
import { Columns } from "./columns";
import { endOfDay, startOfDay, startOfMonth } from "date-fns";

const RevenueTargetPage = async () => {
  const revenueTargets = await prisma.revenueTarget.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const today = new Date();
  const revenueTargetsData = await Promise.all(
    revenueTargets.map(async (target) => {
      let fromDate = target.fromDate;
      let untilDate = target.untilDate;

      if (target.category === "DAILY") {
        fromDate = startOfDay(today);
        untilDate = endOfDay(today);
      } else if (target.category === "MONTHLY") {
        fromDate = startOfMonth(today);
        untilDate = endOfDay(today);
      }

      const income = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: "INCOME",
          createdAt: {
            gte: fromDate,
            lte: untilDate,
          },
        },
      });

      const expense = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: "EXPENSE",
          createdAt: {
            gte: fromDate,
            lte: untilDate,
          },
        },
      });

      const totalIncome = Number(income._sum.amount ?? 0);
      const totalExpense = Number(expense._sum.amount ?? 0);
      const totalBalance = totalIncome - totalExpense;

      const progress = Math.min(
        (totalBalance / Number(target.totalTarget)) * 100,
        100
      );

      return {
        id: target.id,
        title: target.title,
        fromDate: target.fromDate,
        untilDate: target.untilDate,
        totalTarget: Number(target.totalTarget),
        totalBalance,
        progress,
        category: target.category,
        status: target.status,
      };
    })
  );

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Revenue Target"
        desc="Manage your revenue target."
        calendar={false}
      />
      <div className="container mx-auto mt-4">
        <DataTable columns={Columns} data={revenueTargetsData} />
        <div className="mt-3">
          <RevenueTargetForm mode="create" />
        </div>
      </div>
    </div>
  );
};

export default RevenueTargetPage;
