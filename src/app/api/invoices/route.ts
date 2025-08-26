import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const p = page ? parseInt(page) : 1;

  const [invoices, count] = await prisma.$transaction([
    prisma.invoice.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        items: { include: { service: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.invoice.count(),
  ]);

  const data = invoices.map((invoice) => ({
    id: invoice.id,
    price: invoice.price,
    notes: invoice.note,
    progress: invoice.progress,
    totalPayment: invoice.price,
    date: invoice.createdAt,
    name: invoice.customer.name,
    photo: invoice.customer.photo,
    items: invoice.items.map((item) => ({
      name: item.name,
      service: item.service.map((s) => s.name),
      status: item.progress,
    })),
  }));

  return NextResponse.json({ data, count });
}
