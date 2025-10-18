"use client";
import { useMemo, useState } from "react";
import { DataList } from "../DataList";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
            <span className="font-medium text-muted-foreground">Category</span>
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
            <div className="mt-3">
              <span className="font-medium text-muted-foreground">
                Filter By
              </span>
              <RadioGroup className="mt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="recentOrder" id="recentOrder" />
                  <Label htmlFor="recentOrder">Recent Order</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="oldOrder" id="oldOrder" />
                  <Label htmlFor="oldOrder">Old Order</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryList;
