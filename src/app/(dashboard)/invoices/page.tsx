import { DataTable } from "@/components/DataTable";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import Pagination from "@/components/Pagination";
import InvoiceList from "@/components/invoice/InvoiceList";

export const revalidate = 0;

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

  const invoiceData = data.map((invoice) => ({
    id: invoice.id,
    progress: invoice.progress,
    totalPayment: Number(invoice.price),
    date: invoice.createdAt,
    name: invoice.customer.name,
    photo: invoice.customer.photo,
    items: invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      service: item.service.map((s) => s.name),
      progress: item.progress,
    })),
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
      {/* <div className="mb-3 w-fit">
        <div className="relative">
          <Input className="text-sm bg-accent" placeholder="Search By Name" />
          <Search className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="">
        <DataTable data={invoiceData} columns={columns} />
        <Pagination page={p} count={count} />
      </div> */}
      <InvoiceList invoices={invoiceData} p={p} count={count} />
    </div>
  );
}

export default InvoicesPage;
