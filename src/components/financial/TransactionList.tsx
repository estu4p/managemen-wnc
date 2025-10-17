"use client";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ExportButton } from "../ExportButton";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DataTable } from "../DataTable";
import Pagination from "../Pagination";
import {
  columns,
  Transaction,
} from "@/app/(dashboard)/financials/transactions/columns";
import { Button } from "../ui/button";
import { format } from "date-fns";

type TransactionListProps = {
  transactions: Transaction[];
  p: number;
  count: number;
  startDate: Date;
  endDate: Date;
};

const TransactionList = ({
  transactions,
  p,
  count,
  startDate,
  endDate,
}: TransactionListProps) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredTransaction = useMemo(() => {
    let result = transactions;

    if (activeFilter !== "ALL") {
      result = result.filter(
        (transaction) => transaction.type === activeFilter
      );
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((transaction) =>
        transaction.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [transactions, activeFilter, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const exportFilters = {
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    search: debouncedSearchQuery.trim() || undefined,
    type: activeFilter !== "ALL" ? activeFilter : undefined,
  };

  return (
    <div>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
        <ToggleGroup
          type="single"
          className="gap-2 rounded-none text-white"
          defaultValue="all"
        >
          <Button
            value="ALL"
            size="sm"
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-md w-fit px-4 hover:bg-secondary-green/80 ${
              activeFilter === "ALL"
                ? "bg-secondary-green text-black"
                : "bg-primary"
            }`}
          >
            All
          </Button>
          <Button
            value="INCOME"
            size="sm"
            onClick={() => setActiveFilter("INCOME")}
            className={`rounded-md w-fit px-4 hover:bg-secondary-green/80 ${
              activeFilter === "INCOME"
                ? "bg-secondary-green text-black"
                : "bg-primary"
            }`}
          >
            Income
          </Button>
          <Button
            value="EXPENSE"
            size="sm"
            onClick={() => setActiveFilter("EXPENSE")}
            className={`rounded-md w-fit px-4 hover:bg-secondary-green/80 ${
              activeFilter === "EXPENSE"
                ? "bg-secondary-green text-black"
                : "bg-primary"
            }`}
          >
            Expense
          </Button>
        </ToggleGroup>
        <div className="flex gap-2 items-center max-sm:justify-end max-sm:w-full">
          <div className="relative">
            <Input
              className="text-sm bg-accent pr-10"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery ? (
              <X
                className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={clearSearch}
              />
            ) : (
              <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <ExportButton filters={exportFilters} />
        </div>
      </div>

      {(activeFilter !== "ALL" || debouncedSearchQuery) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {activeFilter !== "ALL" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
              Type: {activeFilter.toLowerCase()}
            </span>
          )}
          {debouncedSearchQuery && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
              Search: "{debouncedSearchQuery}"
            </span>
          )}
          <span className="text-muted-foreground ml-2">
            ({filteredTransaction.length} results)
          </span>
        </div>
      )}

      <div className="container mx-auto mt-3">
        <DataTable columns={columns} data={filteredTransaction} />
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default TransactionList;
