// lib/financial.ts
import prisma from "@/lib/prisma";
import { eachMonthOfInterval, endOfMonth, startOfMonth } from "date-fns";

export async function getFinancialSummary(startDate?: Date, endDate?: Date) {
  // Buat where clause berdasarkan tanggal jika provided
  const whereClause: any = {};

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const aggregates = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: whereClause,
    orderBy: undefined,
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const ag of aggregates) {
    if (ag.type === "INCOME") totalIncome = Number(ag._sum?.amount || 0);
    if (ag.type === "EXPENSE") totalExpense = Number(ag._sum?.amount || 0);
  }

  return {
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
  };
}

export async function getMonthlyFinancialSummary(year: number) {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  const months = eachMonthOfInterval({ start: startOfYear, end: endOfYear });

  const summaries = await Promise.all(
    months.map(async (monthDate) => {
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const aggregates = await prisma.transaction.groupBy({
        by: ["type"],
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      let income = 0;
      let expense = 0;

      for (const ag of aggregates) {
        if (ag.type === "INCOME") income = Number(ag._sum.amount ?? 0);
        if (ag.type === "EXPENSE") expense = Number(ag._sum.amount ?? 0);
      }

      return {
        month: monthDate.toLocaleString("default", { month: "long" }),
        income,
        expense,
      };
    })
  );

  return summaries;
}
