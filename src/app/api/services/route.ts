import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: {
      name: "desc",
    },
  });

  const data = services.map((service) => ({
    id: service.id,
    name: service.name,
    price: service.price,
  }));

  return NextResponse.json(data);
}
