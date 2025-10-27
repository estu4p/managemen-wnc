"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

const OrderCardData = [
  {
    title: "New Order",
    key: "NEW_ORDER",
    icon: "/icons/newOrders.png",
    bgIcon: "bg-blue-200",
  },
  {
    title: "Waitting",
    key: "WAITTING",
    icon: "/icons/waitting.png",
    bgIcon: "bg-rose-100",
  },
  {
    title: "On Progress",
    key: "ON_PROGRESS",
    icon: "/icons/onProgress.png",
    bgIcon: "bg-amber-100",
  },
  {
    title: "Ready for Pickup",
    key: "DONE",
    icon: "/icons/readyToTake.png",
    bgIcon: "bg-lime-100",
  },
];

type Progress = {
  name: string;
  progress: string;
};

const InvoiceMonitoring = ({ data }: { data: Progress[] }) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    // Hitung progress count ketika data berubah
    const progressCount = data.reduce((acc, curr) => {
      const progressKey =
        curr.progress === "FINISHING" ? "ON_PROGRESS" : curr.progress;
      acc[progressKey] = (acc[progressKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCounts(progressCount);
  }, [data]);

  const cardsWithCount = OrderCardData.map((item) => ({
    ...item,
    count: counts[item.key] || 0,
  }));

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap max-w-full">
      {cardsWithCount.map((item) => (
        <Card
          key={item.title}
          className="min-w-[130px] h-[110px] flex-1 py-3 rounded-md justify-between gap-0"
        >
          <CardHeader className="font-medium px-4 gap-0 leading-tight text-base">
            {item.title}
          </CardHeader>
          <CardContent className="flex items-center justify-between px-4">
            <span className="font-medium text-2xl">{item.count}</span>
            {/* <span className="font-medium text-2xl">{hi}</span> */}
            <div className={cn("p-2 rounded-full", item.bgIcon)}>
              {/* <Image
                src={item.icon}
                alt="icon new order"
                height={20}
                width={20}
              /> */}
              {/* <img src={item.icon} alt={item.title} width={20} height={20} /> */}
              <img
                src={item.icon}
                alt={`icon ${item.title}`}
                className="w-5 h-5 object-contain"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InvoiceMonitoring;
