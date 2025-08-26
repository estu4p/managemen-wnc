// lib/financial.ts
import prisma from "@/lib/prisma";

export async function getFinancialSummary() {
  const aggregates = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
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
