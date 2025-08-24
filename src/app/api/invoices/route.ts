import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    // take: 6,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: { include: { service: true } },
    },
  });

  const data = invoices.map((invoice) => ({
    id: invoice.id,
    price: invoice.price,
    notes: invoice.note,
    progress: invoice.progress,
    totalPayment: invoice.price,
    date: invoice.createdAt,
    name: invoice.customer.name,
    photo: invoice.customer.photo,
    // items: invoice.items.map((item) => ({
    //   name: item.name,
    //   service: item.service.name,
    //   status: item.progress,
    // })),
  }));

  return NextResponse.json(data);
}
