"use client";
import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import OrderCard from "@/components/order/OrderCard";
import OrderTable from "@/components/order/OrderTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const OrderCardData = [
  {
    title: "New Order",
    count: 18,
    icon: "/icons/newOrders.png",
    bgIcon: "bg-blue-200",
  },
  {
    title: "Waitting",
    count: 7,
    icon: "/icons/waitting.png",
    bgIcon: "bg-rose-100",
  },
  {
    title: "On Progress",
    count: 8,
    icon: "/icons/onProgress.png",
    bgIcon: "bg-amber-100",
  },
  {
    title: "Ready for Pickup",
    count: 9,
    icon: "/icons/readyToTake.png",
    bgIcon: "bg-lime-100",
  },
];

const FilterStatusData = [
  {
    id: "new",
    label: "New",
  },
  {
    id: "waitting",
    label: "Waitting",
  },
  {
    id: "onProgress",
    label: "On Progress",
  },
  {
    id: "readyForPickup",
    label: "Ready for Pickup",
  },
];

const Home = () => {
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("api/invoices")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Work Monitoring"
        desc="Monitor and track your work progress effectively."
      />
      {/* order data */}
      <div className="flex items-center justify-center gap-3 flex-wrap max-w-full">
        {OrderCardData.map((item) => (
          <Card
            key={item.title}
            className="min-w-[130px] h-[110px] flex-1 py-3 rounded-md justify-between gap-0"
          >
            <CardHeader className="font-medium px-4 gap-0 leading-tight text-base">
              {item.title}
            </CardHeader>
            <CardContent className="flex items-center justify-between px-4">
              <span className="font-medium text-2xl">{item.count}</span>
              <div className={cn("p-2 rounded-full", item.bgIcon)}>
                <Image
                  src={item.icon}
                  alt="icon new order"
                  height={20}
                  width={20}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/*  */}
      <div className="mt-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 max-sm:w-full justify-between">
            <h1 className="font-medium text-base">Order List</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "space-x-2",
                  viewMode === "list" &&
                    "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground"
                )}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("card")}
                className={cn(
                  "space-x-2",
                  viewMode === "card" &&
                    "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Card</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between max-sm:w-full gap-3 ">
            {/* SearchBar */}
            <div className="relative">
              <Input className="text-sm bg-accent" placeholder="Search Order" />
              <Search className=" absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FiltersDropdown filterStatusData={FilterStatusData} />
          </div>
        </div>
        <div className="mt-3 max-sm:mt-6 flex gap-3 transition-all duration-300 ease-in-out">
          {viewMode === "list" ? (
            <OrderTable data={orders} />
          ) : (
            <OrderCard data={orders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
