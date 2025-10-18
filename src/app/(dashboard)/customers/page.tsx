import HeaderPage from "@/components/HeaderPage";
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
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { DataList } from "@/components/DataList";

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

async function CustomersPage(props: {
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
    prisma.customer.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        invoices: {
          select: {
            _count: {
              select: {
                items: true,
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.customer.count({
      where: whereClause,
    }),
  ]);

  const customerData = data.map((cust) => ({
    id: cust.id,
    photo: cust.photo,
    name: cust.name,
    phone: cust.phone,
    totalItem: cust.invoices.reduce((sum, inv) => sum + inv._count.items, 0),
    totalInvoice: cust.invoices.length,
    firstTime: cust.createdAt,
  }));

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Customer Records"
        desc="Find all customer records, categorized and easy to search."
        calendar={false}
      />
      <DataList
        data={customerData}
        columns={columns}
        page={p}
        count={count}
        searchPlaceholder="Search by customer name..."
        searchKey="search"
        externalSearch={searchQuery}
      />
    </div>
  );
}

export default CustomersPage;
