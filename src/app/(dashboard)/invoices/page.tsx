import FiltersDropdown from "@/components/FiltersDropdown";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrderTable from "@/components/workMonitoring/OrderTable";
import prisma from "@/lib/prisma";
import { Search } from "lucide-react";
import Link from "next/link";

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

async function InvoicesPage() {
  const invoice = await prisma.invoice.findMany({
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });

  const invoiceData = invoice.map((inv) => ({
    id: inv.id,
    name: inv.customer.name,
    totalPayment: Number(inv.price),
    progress: inv.progress,
    date: inv.createdAt,
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
        <OrderTable data={invoiceData} />
      </div>
    </div>
  );
}

export default InvoicesPage;
