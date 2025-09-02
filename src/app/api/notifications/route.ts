import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const data = notifications.map((notif) => ({
    id: notif.id,
    title: notif.title,
    category: notif.category,
    message: notif.message,
    isRead: notif.isRead,
  }));

  return NextResponse.json(data);
}
