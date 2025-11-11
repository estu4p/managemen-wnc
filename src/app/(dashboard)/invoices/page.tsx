import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { DataList } from "@/components/DataList";

export const revalidate = 0;

async function InvoicesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;
  const searchQuery = search || "";

  const whereClause = searchQuery
    ? {
        OR: [
          {
            customer: {
              name: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
          },
          {
            items: {
              some: {
                name: {
                  contains: searchQuery,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      }
    : {};

  const [data, count] = await prisma.$transaction([
    prisma.invoice.findMany({
      where: whereClause,
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
            phone: true,
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
    prisma.invoice.count({
      where: whereClause,
    }),
  ]);

  const invoiceData = data.map((invoice) => ({
    id: invoice.id,
    progress: invoice.progress,
    totalPayment: Number(invoice.price),
    date: invoice.createdAt,
    name: invoice.customer.name,
    phone: invoice.customer.phone,
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

      <DataList
        data={invoiceData}
        columns={columns}
        page={p}
        count={count}
        searchPlaceholder="Search by name ..."
        searchKey="search"
        externalSearch={searchQuery}
      />
    </div>
  );
}

export default InvoicesPage;
