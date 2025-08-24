import HeaderPage from "@/components/HeaderPage";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { serialize } from "@/lib/format";
import prisma from "@/lib/prisma";

async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
      items: {
        include: { service: true },
      },
      discounts: true,
    },
  });

  if (!invoice) {
    return <h2>Invoice not found</h2>;
  }

  const invoiceData = serialize(invoice);

  return (
    <div className="p-4 sm:px-7">
      <div className="flex justify-between items-end">
        <HeaderPage
          title="Order Details"
          desc="View and manage order details, including items, customer information, and status updates."
          calendar={false}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="mb-3">
              Preview
            </Button>
          </SheetTrigger>
          <SheetContent className="max-sm:w-[90%]">
            <SheetTitle>Order Preview</SheetTitle>
            <SheetDescription>
              This is a preview of the order details. You can review the
              customer information, items, and payment details before finalizing
              the order.
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
      <div className="mt-6">
        <InvoiceForm invoice={invoiceData} />
      </div>
    </div>
  );
}

export default OrderDetailsPage;
