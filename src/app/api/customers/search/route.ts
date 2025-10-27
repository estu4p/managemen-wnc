import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json([]);
  }

  const customers = await prisma.customer.findMany({
    where: {
      phone: {
        contains: phone,
        mode: "insensitive",
      },
    },
    take: 5,
  });

  return NextResponse.json(customers);
}
