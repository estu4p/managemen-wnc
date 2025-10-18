import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataList } from "@/components/DataList";
import InventoryList from "@/components/inventory/InventoryList";

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
  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;
  const searchQuery = search || "";

  const whereClause = searchQuery
    ? {
        name: {
          contains: searchQuery,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [data, count] = await prisma.$transaction([
    prisma.inventory.findMany({
      where: whereClause,
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
    prisma.inventory.count({
      where: whereClause,
    }),
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
        <div className="flex justify-end lg:hidden">
          <FiltersDropdown
            filterStatusData={FilterStatusData}
            subTitle="Category"
            className="text-sm"
          />
        </div>
      </div>
      <div>
        {/* left */}
        <div className="container mx-auto">
          {/* <DataList
            data={inventoryData}
            columns={columns}
            page={p}
            count={count}
            searchPlaceholder="Search by customer name..."
            searchKey="search"
            externalSearch={searchQuery}
          /> */}
          <InventoryList
            data={inventoryData}
            columns={columns}
            p={p}
            count={count}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}

export default InventoriesPage;
