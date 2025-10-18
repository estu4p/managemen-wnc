"use client";

import { useState, useEffect } from "react";
import { SearchInput } from "./SearchInput";
import { DataTable } from "./DataTable";
import Pagination from "./Pagination";
import { useSearchParams } from "@/hooks/useSearchParams";

interface DataListProps<T> {
  data: T[];
  columns: any;
  page: number;
  count: number;
  searchPlaceholder?: string;
  searchKey?: string;
  externalSearch?: string;
}

export function DataList<T>({
  data,
  columns,
  page,
  count,
  searchPlaceholder = "Search...",
  searchKey = "search",
  externalSearch = "",
}: DataListProps<T>) {
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
    <div>
      <div className="mb-3">
        <SearchInput
          placeholder={searchPlaceholder}
          searchQuery={currentSearch}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div>
        <DataTable data={data} columns={columns} />
        <Pagination page={page} count={count} />
      </div>
    </div>
  );
}
