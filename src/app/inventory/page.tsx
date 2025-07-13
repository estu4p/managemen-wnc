import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

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

const InventoryData = [
  {
    id: "detoxy",
    product: "Detoxy",
    category: "Soap",
    stock: "5 L",
  },
  {
    id: "sikatSuede",
    product: "Sikat Suede",
    category: "Brush",
    stock: "5 Pcs",
  },
  {
    id: "premiumCleaner",
    product: "Premium Cleaner",
    category: "Cleaning Solution",
    stock: "10 L",
  },
  {
    id: "mikrofiberTowel",
    product: "Mikrofiber Towel",
    category: "Cloth",
    stock: "20 Pcs",
  },
  {
    id: "cupSoleBrush",
    product: "Cup Sole Brush",
    category: "Brush",
    stock: "7 Pcs",
  },
  {
    id: "deodorizerSpray",
    product: "Deodorizer Spray",
    category: "Spray",
    stock: "12 Bottles",
  },
  {
    id: "shoeTree",
    product: "Shoe Tree",
    category: "Accessory",
    stock: "10 Pairs",
  },
  {
    id: "essentialKitBox",
    product: "Essential Kit Box",
    category: "Package",
    stock: "5 Boxes",
  },
];

const Inventory = () => {
  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-end justify-between">
        <HeaderPage
          title="Inventory Data"
          desc="Manage and track your inventory effectively."
          calendar={false}
        />
        <Link href="/inventory/add" className="mb-3">
          <Button variant="default" size="sm">
            Add New
          </Button>
        </Link>
      </div>
      <div className="flex justify-end lg:hidden">
        <FiltersDropdown
          filterStatusData={FilterStatusData}
          subTitle="Category"
          className="text-sm"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* left */}
        <div className="container mx-auto">
          <div className=" rounded-md border h-fit">
            <Table>
              <TableHeader className="bg-primary-gray">
                <TableRow>
                  <TableHead className="min-w-[250px] text-primary">
                    Product
                  </TableHead>
                  <TableHead className="text-primary">Category</TableHead>
                  <TableHead className="text-primary">Stock</TableHead>
                  <TableHead className="text-right text-primary">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {InventoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell className="text-right">
                      <Button size="iconXs">
                        <Link href={`/inventory/${item.id}`}>
                          <MoveUpRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              //   onClick={() => table.previousPage()}
              //   disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              //   onClick={() => table.nextPage()}
              //   disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
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
};

export default Inventory;
