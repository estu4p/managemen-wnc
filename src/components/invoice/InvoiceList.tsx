"use client";

import { columns, Invoice } from "@/app/(dashboard)/invoices/columns";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { DataTable } from "../DataTable";
import Pagination from "../Pagination";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

type InvoiceListProps = {
  invoices: Invoice[];
  p: number;
  count: number;
};

const InvoiceList = ({ invoices, p, count }: InvoiceListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredTransaction = useMemo(() => {
    let result = invoices;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((invoice) =>
        invoice.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [invoices, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <div className="mb-3 w-fit">
        <div className="relative">
          <Input
            className="text-sm bg-accent"
            placeholder="Search By Name"
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
      </div>

      {debouncedSearchQuery && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
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

      <div className="">
        <DataTable data={filteredTransaction} columns={columns} />
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
};

export default InvoiceList;
