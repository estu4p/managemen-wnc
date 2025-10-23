"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTable } from "../DataTable";
import { columns } from "@/app/(dashboard)/invoices/columns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Pagination from "../Pagination";
import OrderCard from "./OrderCard";
import { useSearchParams } from "@/hooks/useSearchParams";
import { SearchInput } from "../SearchInput";

interface WorkMonitoringProps {
  invoices: any[];
  columns: any;
  page: number;
  count: number;
  searchKey?: string;
  externalSearch?: string;
}

const WorkMonitoringTable = ({
  invoices,
  columns,
  page,
  count,
  searchKey = "search",
  externalSearch = "",
}: WorkMonitoringProps) => {
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const { searchParams, updateSearchParams } = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchChange = (query: string) => {
    updateSearchParams({
      [searchKey]: query || null,
      page: "1",
    });
  };

  const currentSearch = isClient
    ? searchParams.get(searchKey) || ""
    : externalSearch;

  return (
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
        <div className="max-sm:text-end max-sm:w-full flex justify-end">
          {/* SearchBar */}
          <div className="relative w-fit">
            <SearchInput
              placeholder="Search Invoice"
              searchQuery={currentSearch}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-3 transition-all duration-300 ease-in-out">
        {viewMode === "list" ? (
          <div className="w-full">
            <DataTable data={invoices} columns={columns} />
            <Pagination page={page} count={count} />
          </div>
        ) : (
          <OrderCard data={invoices} page={page} count={count} />
        )}
      </div>
    </div>
  );
};

export default WorkMonitoringTable;
