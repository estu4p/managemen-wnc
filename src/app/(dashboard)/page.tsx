import HeaderPage from "@/components/HeaderPage";
import InvoiceMonitoring from "@/components/workMonitoring/InvoiceMonitoring";
import { columns } from "./invoices/columns";
import WorkMonitoringTable from "@/components/workMonitoring/WorkMonitoringTable";
import { ITEM_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";

type Invoice = {
  id: string;
  price: string;
  notes: string;
  progress: string;
  totalPayment: number;
  date: Date;
  name: string;
  photo: string;
  items: { name: string; service: string; progress: string }[];
};

async function DashboardHome(props: {
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

  const allProgressData = (
    await prisma.invoice.findMany({
      select: { items: { select: { name: true, progress: true } } },
    })
  ).flatMap((invoice) => invoice.items);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Work Monitoring"
        desc="Monitor and track your work progress effectively."
        calendar={false}
      />
      {/* order data */}
      <div className="">
        <InvoiceMonitoring data={allProgressData} />
      </div>
      {/*  */}
      <WorkMonitoringTable
        invoices={invoiceData}
        columns={columns}
        page={p}
        count={count}
      />
    </div>
  );
}

export default DashboardHome;
