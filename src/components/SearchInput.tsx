"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  placeholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  searchQuery,
  onSearchChange,
  className = "",
}: SearchInputProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 500);

  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange, searchQuery]);

  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const clearSearch = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <div className={`relative w-fit ${className}`}>
      <Input
        className="text-sm bg-accent pr-10"
        placeholder={placeholder}
        value={localQuery}
        onChange={handleChange}
      />
      {localQuery ? (
        <X
          className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={clearSearch}
        />
      ) : (
        <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
