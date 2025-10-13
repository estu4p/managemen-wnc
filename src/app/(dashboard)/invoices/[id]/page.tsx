import HeaderPage from "@/components/HeaderPage";
import InvoiceForm from "@/components/form/InvoiceForm";
import { Button } from "@/components/ui/button";
import { serialize } from "@/lib/format";
import prisma from "@/lib/prisma";

async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: { service: true },
      },
      discounts: true,
    },
  });

  const formInvoice = {
    ...invoice,
    items: invoice?.items.map((item) => ({
      ...item,
      service: item.service.map((s) => s.id),
      serviceDetail: item.service.map((s) => ({
        id: s.id,
        name: s.name,
      })),
    })),
  };

  if (!invoice) {
    return <h2>Invoice not found</h2>;
  }

  const invoiceData = serialize(formInvoice);

  return (
    <div className="p-4 sm:px-7">
      <div className="flex justify-between items-end ">
        <HeaderPage
          title="Invoice Details"
          desc="View and manage invoice details, including items, customer information, and payment information."
          calendar={false}
        />
        <div className="flex gap-2 mb-3">
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <InvoiceForm mode="update" defaultValues={invoiceData} />
      </div>
    </div>
  );
}

export default OrderDetailsPage;
