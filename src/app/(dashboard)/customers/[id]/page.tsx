import CustomerDetails from "@/components/customer/CustomerDetails";
import HeaderPage from "@/components/HeaderPage";
import prisma from "@/lib/prisma";

async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      invoices: {
        orderBy: {
          createdAt: "desc",
        },
        include: { items: true },
      },
    },
  });

  const customerData = customer && {
    ...customer,
    invoice: customer.invoices.map((inv) => ({
      ...inv,
      price: inv.price.toNumber(),
      addDiscount: inv.addDiscount?.toNumber(),
    })),
  };

  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-center justify-between">
        <HeaderPage
          title="Customer Details"
          desc="View and manage customer details"
          calendar={false}
        />
      </div>
      {!customer ? (
        <h2>Customer not found</h2>
      ) : (
        <CustomerDetails customer={customerData} />
      )}
    </div>
  );
}

export default CustomerDetailsPage;
