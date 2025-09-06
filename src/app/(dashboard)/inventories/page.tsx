import { DataTable } from "@/components/DataTable";
import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { columns } from "./columns";

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

async function InventoriesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.inventory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        currentStock: true,
        unit: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.inventory.count(),
  ]);

  const inventoryData = data.map((inv) => ({
    id: inv.id,
    name: inv.name,
    category: inv.category,
    currentStock: inv.currentStock,
    unit: inv.unit,
  }));

  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-end justify-between">
        <HeaderPage
          title="Inventory Data"
          desc="Manage and track your inventories effectively."
          calendar={false}
        />
        <Link href="/inventories/new" className="mb-3">
          <Button variant="default" size="sm">
            <Plus />
            Add New
          </Button>
        </Link>
      </div>
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
          <DataTable columns={columns} data={inventoryData} />
          <Pagination page={p} count={count} />
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

export default InventoriesPage;
