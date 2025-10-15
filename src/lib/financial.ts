// lib/financial.ts
import prisma from "@/lib/prisma";

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
