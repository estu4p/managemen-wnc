import HeaderPage from "@/components/HeaderPage";
import React from "react";

import { Input } from "@/components/ui/input";
import { MoveUpRight, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FiltersDropdown from "@/components/FiltersDropdown";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/format";

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

async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    // include: {
    //   items: true,
    // },
  });

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Customer Records"
        desc="Find all customer records, categorized and easy to search."
        calendar={false}
      />
      {/* {customers.map((customer, index) => (
        <p key={customer.id}>{customer.name}</p>
      ))} */}
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
        {/* <div className="container mx-auto">
          <DataTable columns={columns} data={data} />
        </div> */}
        <div className="container mx-auto">
          <div className=" rounded-md border h-fit">
            <Table>
              <TableHeader className="bg-primary-gray">
                <TableRow>
                  <TableHead className="text-primary">ID</TableHead>
                  <TableHead className="text-primary">Name</TableHead>
                  <TableHead className="text-primary">Phone</TableHead>
                  <TableHead className="text-primary">Total Items</TableHead>
                  <TableHead className="text-primary">Total Invoices</TableHead>
                  <TableHead className=" text-primary">
                    First Time Coming
                  </TableHead>
                  <TableHead className=" text-right text-primary">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {/* <TableCell>{customer.items.length}</TableCell>
                    <TableCell>{customer.items.length}</TableCell> */}
                    {/* <TableCell>{customer.invoices.length}</TableCell> */}
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="iconXs">
                        <Link href={`/customers/${customer.id}`}>
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

export default CustomersPage;
