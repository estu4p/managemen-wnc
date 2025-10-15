"use client";
import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import OrderCard from "@/components/workMonitoring/OrderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Search } from "lucide-react";
import { useEffect, useState } from "react";
import InvoiceMonitoring from "@/components/workMonitoring/InvoiceMonitoring";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { columns } from "./invoices/columns";
import Pagination from "@/components/Pagination";
import { Progress } from "@prisma/client";

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

type Invoice = {
  id: string;
  price: string;
  notes: string;
  progress: string;
  totalPayment: number;
  date: Date;
  name: string;
  photo: string;
  items: { name: string; service: string; progress: string }[];
};

const DashboardHome = () => {
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const p = page ? parseInt(page, 10) : 1;

  const [orders, setOrders] = useState<Invoice[]>([]);
  const [count, setCount] = useState(0);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/invoices?page=${p}`)
      .then((res) => res.json())
      .then((resData) => {
        setOrders(resData.data);
        setCount(resData.count);
      });
  }, [p]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const res = await fetch("/api/invoices/progress");
        const resData = await res.json();

        const allProgressData = resData.data.flatMap((invoice: any) =>
          invoice.items.map((item: any) => ({
            name: item.name,
            progress: item.progress,
          }))
        );

        setProgressData(allProgressData);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  // const itemProgress = orders.flatMap((order) =>
  //   order.items.map((item) => ({
  //     name: item.name,
  //     progress: item.progress,
  //   }))
  // );

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Work Monitoring"
        desc="Monitor and track your work progress effectively."
      />
      {/* order data */}
      <div className="">
        <InvoiceMonitoring data={progressData} />
      </div>
      {/*  */}
      <div className="mt-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 max-sm:w-full justify-between">
            <h1 className="font-medium text-base">Invoices List</h1>
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
              <Input
                className="text-sm bg-accent"
                placeholder="Search Invoice"
              />
              <Search className=" absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <FiltersDropdown filterStatusData={FilterStatusData} />
          </div>
        </div>
        <div className="mt-3 max-sm:mt-6 flex gap-3 transition-all duration-300 ease-in-out">
          {viewMode === "list" ? (
            // <OrderTable data={orders} page={p} count={count} />
            <div className="w-full">
              <DataTable data={orders} columns={columns} />
              <Pagination page={p} count={count} />
            </div>
          ) : (
            <OrderCard data={orders} page={p} count={count} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
