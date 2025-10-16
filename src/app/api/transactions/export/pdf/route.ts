import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jsPDF from "jspdf";

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

    const doc = new jsPDF();

    doc.setProperties({
      title: "Financial Transaction Report",
      subject: "Transaction Export",
      author: "Your App Name",
      creator: "Your App Name",
    });

    const colors = {
      primary: [30, 64, 175],
      success: [22, 163, 74],
      danger: [220, 38, 38],
      gray: [107, 114, 128],
      lightGray: [209, 213, 219],
    };

    doc.setFontSize(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text("FINANCIAL TRANSACTION REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${new Date().toLocaleDateString(
        "id-ID"
      )} ${new Date().toLocaleTimeString("id-ID")}`,
      105,
      30,
      { align: "center" }
    );

    if (startDate && endDate) {
      doc.text(
        `Period: ${new Date(startDate).toLocaleDateString(
          "id-ID"
        )} - ${new Date(endDate).toLocaleDateString("id-ID")}`,
        105,
        36,
        { align: "center" }
      );
    }

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const net = income - expense;
    const incomeCount = transactions.filter((t) => t.type === "INCOME").length;
    const expenseCount = transactions.filter(
      (t) => t.type === "EXPENSE"
    ).length;

    let yPos = 50;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const summaryData = [
      {
        label: "Total Income",
        value: `Rp ${income.toLocaleString("id-ID")}`,
        color: colors.success,
      },
      {
        label: "Total Expense",
        value: `Rp ${expense.toLocaleString("id-ID")}`,
        color: colors.danger,
      },
      {
        label: "Net Balance",
        value: `Rp ${net.toLocaleString("id-ID")}`,
        color: colors.primary,
      },
      {
        label: "Total Transactions",
        value: transactions.length.toString(),
        color: colors.gray,
      },
      {
        label: "Income Transactions",
        value: incomeCount.toString(),
        color: colors.success,
      },
      {
        label: "Expense Transactions",
        value: expenseCount.toString(),
        color: colors.danger,
      },
    ];

    summaryData.forEach((item, index) => {
      doc.setTextColor(0, 0, 0);
      doc.text(`${item.label}:`, 20, yPos);

      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(item.value, 80, yPos);

      yPos += 6;
    });

    yPos += 10;

    // Table header
    if (transactions.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("TRANSACTION DETAILS", 20, yPos);
      yPos += 8;

      // Table columns
      const columns = [
        { header: "No", x: 20, width: 10 },
        { header: "Date", x: 35, width: 25 },
        { header: "Title", x: 65, width: 60 },
        { header: "Type", x: 130, width: 25 },
        { header: "Category", x: 160, width: 35 },
        { header: "Amount", x: 200, width: 40 },
      ];

      // Draw table header
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(20, yPos, 170, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      columns.forEach((col) => {
        doc.text(col.header, col.x, yPos + 5);
      });

      yPos += 12;

      // Table rows
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      transactions.forEach((transaction, index) => {
        // Check for page break
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;

          // Redraw header on new page
          doc.setFillColor(
            colors.primary[0],
            colors.primary[1],
            colors.primary[2]
          );
          doc.rect(20, yPos, 170, 8, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          columns.forEach((col) => {
            doc.text(col.header, col.x, yPos + 5);
          });

          yPos += 12;
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
        }

        const amount = Number(transaction.amount);

        // Row data
        doc.text((index + 1).toString(), columns[0].x, yPos);
        doc.text(
          transaction.createdAt.toLocaleDateString("id-ID"),
          columns[1].x,
          yPos
        );

        // Truncate long titles
        const title =
          transaction.title.length > 30
            ? transaction.title.substring(0, 30) + "..."
            : transaction.title;
        doc.text(title, columns[2].x, yPos);

        doc.text(transaction.type, columns[3].x, yPos);
        doc.text(transaction.category, columns[4].x, yPos);

        // Amount with color
        if (transaction.type === "INCOME") {
          doc.setTextColor(
            colors.success[0],
            colors.success[1],
            colors.success[2]
          );
        } else {
          doc.setTextColor(
            colors.danger[0],
            colors.danger[1],
            colors.danger[2]
          );
        }

        doc.text(
          `${
            transaction.type === "INCOME" ? "+" : "-"
          }Rp ${amount.toLocaleString("id-ID")}`,
          columns[5].x,
          yPos,
          { align: "right" }
        );

        doc.setTextColor(0, 0, 0); // Reset color

        yPos += 5;

        // Add notes if available
        if (transaction.notes) {
          const notes =
            transaction.notes.length > 50
              ? transaction.notes.substring(0, 50) + "..."
              : transaction.notes;
          doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
          doc.text(`Notes: ${notes}`, columns[2].x, yPos);
          doc.setTextColor(0, 0, 0);
          yPos += 4;
        }

        // Row separator
        doc.setDrawColor(
          colors.lightGray[0],
          colors.lightGray[1],
          colors.lightGray[2]
        );
        doc.line(20, yPos - 1, 190, yPos - 1);
        yPos += 4;
      });

      // Final balance
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(`Final Balance: Rp ${net.toLocaleString("id-ID")}`, 170, yPos, {
        align: "right",
      });
    } else {
      // No transactions message
      doc.setFontSize(12);
      doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.text("No transactions found for the selected period.", 20, yPos);
    }

    // Generate PDF as buffer
    const pdfOutput = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(pdfOutput);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="transactions-${
          new Date().toISOString().split("T")[0]
        }.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
