import { DataTable } from "@/components/DataTable";
import DiscountForm from "@/components/form/DiscountForm";
import ServiceForm from "@/components/form/ServiceForm";
import HeaderPage from "@/components/HeaderPage";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { discountColumns, serviceColumns } from "./columns";

async function InvoiceSettings() {
  const services = await prisma.service.findMany({
    orderBy: {
      name: "desc",
    },
  });
  const discounts = await prisma.discount.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serviceData = services.map((service) => ({
    id: service.id,
    name: service.name,
    price: Number(service.price),
  }));

  const discountData = discounts.map((disc) => ({
    id: disc.id,
    title: disc.title,
    amount: Number(disc.amount),
    type: disc.type,
    fromDate: disc.fromDate,
    untilDate: disc.untilDate,
  }));

  return (
    <div className="p-4 sm:px-7">
      <div className="">
        <HeaderPage
          title="Invoice Settings"
          desc="Set up and customize invoice details, including discounts, services, and other configurations."
          calendar={false}
        />
      </div>
      <div className="space-y-4">
        {/* Service list */}
        <div className="flex flex-col sm:flex-row mt-8">
          <div className="sm:w-[20%] lg:min-w-[30%]">
            <h2 className="font-medium text-base">Services</h2>
            <p className="text-muted-foreground">Manage service data</p>
          </div>
          <div className="container mx-auto">
            <DataTable columns={serviceColumns} data={serviceData} />
            <div className="mt-3">
              <ServiceForm mode="create" />
            </div>
          </div>
        </div>
        {/* Discount List */}
        <div className="">
          <Separator className="my-2" />
          <div className="flex flex-col sm:flex-row mt-4">
            <div className="sm:w-[20%] lg:min-w-[30%]">
              <h2 className="font-medium text-base">Discounts</h2>
              <p className="text-muted-foreground">Manage discount data</p>
            </div>
            <div className="container mx-auto">
              <DataTable columns={discountColumns} data={discountData} />
              <div className="mt-3">
                <DiscountForm mode="create" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

export default InvoiceSettings;
