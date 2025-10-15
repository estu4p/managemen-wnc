import { DataTable } from "@/components/DataTable";
import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import Pagination from "@/components/Pagination";

// export const dynamic = "force-dynamic"; // ⬅️ ini penting
export const revalidate = 0;

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

async function InvoicesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.invoice.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        price: true,
        createdAt: true,
        progress: true,
        customer: {
          select: {
            name: true,
            photo: true,
          },
        },
        items: {
          include: {
            service: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.invoice.count(),
  ]);

  const invoiceData = data.map((inv) => ({
    id: inv.id,
    photo: inv.customer.photo,
    name: inv.customer.name,
    totalPayment: Number(inv.price),
    progress: inv.progress,
    date: inv.createdAt,
    items: inv.items,
  }));

  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-end justify-between">
        <HeaderPage
          title="Invoice List"
          desc="Manage customer billing records with simple search and categorization."
          calendar={false}
        />
        <Link href="/invoices/new" className="mb-3">
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
      <div className="">
        {/* <OrderTable data={invoiceData} page={p} count={count} /> */}
        <DataTable data={invoiceData} columns={columns} />
        <Pagination page={p} count={count} />
      </div>
    </div>
  );
}

export default InvoicesPage;
