import HeaderPage from "@/components/HeaderPage";
import React from "react";

import { CustomerRecord, columns } from "./columns";
import { DataTable } from "./dataTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FiltersDropdown from "@/components/FiltersDropdown";

const FilterStatusData = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "soap",
    label: "Soap",
  },
  {
    id: "brush",
    label: "Brush",
  },
  {
    id: "cleaningSolution",
    label: "Cleaning Solution",
  },
  {
    id: "cloth",
    label: "Cloth",
  },
  {
    id: "spray",
    label: "Spray",
  },
  {
    id: "accessory",
    label: "Accessory",
  },
  {
    id: "package",
    label: "Package",
  },
];

async function getData(): Promise<CustomerRecord[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    // ...
  ];
}

export default async function CustomersPage() {
  const data = await getData();

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Customer Records"
        desc="Find all customer records, categorized and easy to search."
        calendar={false}
      />
      <div className="mb-3 flex items-center justify-between">
        <div className="relative">
          <Input className="text-sm bg-accent" placeholder="Search By Name" />
          <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex justify-end lg:hidden">
          <FiltersDropdown
            filterStatusData={FilterStatusData}
            subTitle="Category"
            className="text-sm"
          />
        </div>
      </div>
      <div className="flex gap-4">
        {/* left */}
        <div className="container mx-auto">
          <DataTable columns={columns} data={data} />
        </div>
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
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox id={item.id} />
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
    </div>
  );
}
