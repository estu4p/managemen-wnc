import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        items: {
          select: {
            name: true,
            progress: true,
          },
        },
      },
    });

    const data = invoices.map((invoice) => ({
      items: invoice.items.map((item) => ({
        name: item.name,
        progress: item.progress,
      })),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
