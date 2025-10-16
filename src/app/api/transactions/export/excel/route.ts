import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "No", key: "no", width: 8 },
      { header: "Title", key: "title", width: 25 },
      { header: "Type", key: "type", width: 12 },
      { header: "Category", key: "category", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 12 },
      { header: "Notes", key: "notes", width: 30 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "3B82F6" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    transactions.forEach((transaction, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        title: transaction.title,
        type: transaction.type,
        category: transaction.category,
        amount: Number(transaction.amount),
        date: transaction.createdAt.toLocaleDateString("id-ID"),
        notes: transaction.notes || "-",
      });

      if (transaction.type === "INCOME") {
        row.getCell("amount").font = { color: { argb: "16A34A" } };
      } else {
        row.getCell("amount").font = { color: { argb: "DC2626" } };
      }
    });

    const summarySheet = workbook.addWorksheet("Summary");

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const net = income - expense;

    summarySheet.mergeCells("A1:C1");
    const titleCell = summarySheet.getCell("A1");
    titleCell.value = "FINANCIAL SUMMARY REPORT";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center" };

    summarySheet.addRow([]);

    summarySheet.addRow([
      "Total Income",
      "",
      `Rp ${income.toLocaleString("id-ID")}`,
    ]);
    summarySheet.addRow([
      "Total Expense",
      "",
      `Rp ${expense.toLocaleString("id-ID")}`,
    ]);
    summarySheet.addRow([
      "Net Balance",
      "",
      `Rp ${net.toLocaleString("id-ID")}`,
    ]);
    summarySheet.addRow([]);
    summarySheet.addRow(["Total Transactions", "", transactions.length]);
    summarySheet.addRow([
      "Income Transactions",
      "",
      transactions.filter((t) => t.type === "INCOME").length,
    ]);
    summarySheet.addRow([
      "Expense Transactions",
      "",
      transactions.filter((t) => t.type === "EXPENSE").length,
    ]);

    for (let i = 3; i <= 9; i++) {
      const row = summarySheet.getRow(i);
      if (i === 5) {
        // Net Balance row
        row.font = { bold: true };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="transactions-${
          new Date().toISOString().split("T")[0]
        }.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
