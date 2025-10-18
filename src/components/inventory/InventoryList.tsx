"use client";
import { useMemo, useState } from "react";
import { DataList } from "../DataList";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FiltersDropdown from "../FiltersDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, Filter } from "lucide-react";

const FilterStatusData = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "EQUIPMENT",
    label: "Equipment",
  },
  {
    id: "MATERIAL",
    label: "Material",
  },
  {
    id: "PRODUCT",
    label: "Product",
  },
  {
    id: "OTHER",
    label: "Other",
  },
];

interface InventoryListProps {
  data: any;
  columns: any;
  p: number;
  count: number;
  searchQuery?: string;
}

const InventoryList = ({
  data,
  columns,
  p,
  count,
  searchQuery = "",
}: InventoryListProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredInventory = useMemo(() => {
    if (activeFilter !== "all") {
      data = data.filter(
        (d: { category: string }) => d.category === activeFilter
      );
    }
    return data;
  }, [data, activeFilter]);

  return (
    <div className="">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex justify-end lg:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-none">
                <Filter className="" />
                <span className="border-none text-base font-medium">
                  Filters
                </span>
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] mr-8">
              <span className="font-medium text-muted-foreground text-sm">
                Category
              </span>
              <div className="mt-2 space-y-3">
                {FilterStatusData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                    onClick={() => setActiveFilter(item.id)}
                  >
                    <Checkbox
                      id={item.id}
                      className=" data-[state=checked]:bg-secondary-green data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-secondary-green data-[state=checked]:border-secondary-green"
                      checked={item.id === activeFilter}
                    />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-4">
        {/* left */}
        <div className="container mx-auto">
          <DataList
            data={filteredInventory}
            columns={columns}
            page={p}
            count={count}
            searchPlaceholder="Search by customer name..."
            searchKey="search"
            externalSearch={searchQuery}
          />
        </div>
        {/* right */}
        <div className="w-fit max-lg:hidden">
          <Card className="min-w-[180px] h-fit rounded-md py-3 gap-4">
            <CardHeader className="gap-0 px-4 font-semibold text-base">
              Filters
            </CardHeader>
            <CardContent className="px-4">
              <span className="font-medium text-muted-foreground">
                Category
              </span>
              <div className="mt-2 space-y-3">
                {FilterStatusData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                    onClick={() => setActiveFilter(item.id)}
                  >
                    <Checkbox id={item.id} checked={activeFilter === item.id} />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
