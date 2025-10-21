import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const discounts = await prisma.discount.findMany({
    orderBy: {
      title: "desc",
    },
  });

  const data = discounts.map((discount) => ({
    id: discount.id,
    name: discount.title,
    price: discount.amount,
    type: discount.type,
  }));

  return NextResponse.json(data);
}
