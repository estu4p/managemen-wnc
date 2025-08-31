import CustomerDetails from "@/components/customer/CustomerForm";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { serialize } from "@/lib/format";
import prisma from "@/lib/prisma";

async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      invoices: {
        select: {
          id: true,
          price: true,
          createdAt: true,
          progress: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    return <h2>Customer not found</h2>;
  }

  const customerData = serialize(customer);

  return (
    <div className="p-4 sm:px-7">
      <div className="flex justify-between items-end">
        <HeaderPage
          title="Customer Details"
          desc="View and manage customer details"
          calendar={false}
        />
        <Button size="sm" variant="destructive" className="mb-3">
          Delete
        </Button>
      </div>
      <CustomerDetails customer={customerData} />
    </div>
  );
}

export default CustomerDetailsPage;
