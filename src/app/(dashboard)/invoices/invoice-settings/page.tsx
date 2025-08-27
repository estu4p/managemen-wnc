import DiscountForm from "@/components/form/DiscountForm";
import ServiceForm from "@/components/form/ServiceForm";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { Plus, SquarePen, Trash2 } from "lucide-react";

async function InvoiceSettings() {
  const services = await prisma.service.findMany({
    // orderBy: {
    //     createdAt: "desc",
    // }
  });
  const discounts = await prisma.discount.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
            <div className=" rounded-md border h-fit">
              <Table>
                <TableHeader className="bg-primary-gray">
                  <TableRow>
                    <TableHead className="text-primary">No</TableHead>
                    <TableHead className="text-primary">Name</TableHead>
                    <TableHead className="text-primary">Price</TableHead>
                    <TableHead className="text-primary w-[0px] text-end">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{formatRupiah(service.price)}</TableCell>
                      <TableCell className="text-right w-fit space-x-1.5 flex">
                        <ServiceForm
                          mode="edit"
                          defaultValues={{
                            name: service.name,
                            price: Number(service.price),
                          }}
                        />
                        <ServiceForm
                          mode="delete"
                          defaultValues={{ name: service.name }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
              <div className=" rounded-md border h-fit">
                <Table>
                  <TableHeader className="bg-primary-gray">
                    <TableRow>
                      <TableHead className="text-primary">No</TableHead>
                      <TableHead className="text-primary">Name</TableHead>
                      <TableHead className="text-primary">Discount</TableHead>
                      <TableHead className="text-primary">From Date</TableHead>
                      <TableHead className="text-primary">Until Date</TableHead>
                      <TableHead className="text-primary w-[0px] text-end">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{discount.name}</TableCell>
                        <TableCell>
                          {discount.type === "PERCENTAGE"
                            ? `${Number(discount.discount)} %`
                            : formatRupiah(discount.discount)}
                        </TableCell>
                        <TableCell>{formatDate(discount.createdAt)}</TableCell>
                        <TableCell>{formatDate(discount.createdAt)}</TableCell>
                        <TableCell className="text-right w-fit space-x-1.5 flex">
                          <DiscountForm
                            mode="edit"
                            defaultValues={{
                              name: discount.name,
                              discount: Number(discount.discount),
                              date: discount.createdAt,
                            }}
                          />
                          <DiscountForm
                            mode="delete"
                            defaultValues={{ name: discount.name }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
