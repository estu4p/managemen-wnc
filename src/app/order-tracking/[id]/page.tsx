import { Service } from "@/app/(dashboard)/invoices/invoice-settings/columns";
import DetailsNote from "@/components/note/NoteDetails";
import TrackingMap from "@/components/note/TrackingMap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateServiceSummary } from "@/lib/calculateServiceSummary";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";
import { transformInvoiceForCalculation } from "@/lib/invoiceHelper";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Progress } from "@prisma/client";
import Image from "next/image";

async function NotePage({ params }: { params: Promise<{ id: string }> }) {
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

  if (!invoice) {
    return <h2>Invoice not found</h2>;
  }

  const { selectedServices, serviceList, discounts } =
    transformInvoiceForCalculation(invoice);
  const serviceSummary = calculateServiceSummary(
    selectedServices,
    serviceList as Service[],
    discounts
  );

  return (
    <div className="flex justify-center">
      <div className="w-[40rem] min-h-screen md:m-3 p-4 rounded-md border border-border text-sm bg-background">
        <div className="flex gap-2 items-center">
          <Image src="/images/logo.jpg" alt="logo wnc" width={50} height={50} />
          <div>
            <h2 className="text-xl font-medium">Wash & Care</h2>
            <p className="-mt-0.5">Order Tracking</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 mt-4 w-full ">
          <div>
            <h3>Name</h3>
            <p className="font-medium capitalize">{invoice?.customer.name}</p>
          </div>
          <div>
            <h3>Order ID</h3>
            <p className="font-medium">{invoice.id}</p>
          </div>
          <div>
            <h3>Incoming Order</h3>
            <p className="font-medium">
              {formatDate(invoice.createdAt)} | {formatTime(invoice.createdAt)}
            </p>
          </div>
          <div>
            <h3>Estimated Completion</h3>
            {/* <p className="font-medium">2023-10-01</p> */}
            {invoice.items.map((item, index) => (
              <li key={item.id} className="font-medium capitalize">
                {item.name} :{" "}
                {item.estimatedCompletion
                  ? `${formatDate(item.estimatedCompletion)} | ${formatTime(
                      item.estimatedCompletion
                    )}`
                  : "Belum ditentukan"}
              </li>
            ))}
          </div>
          <div>
            <h3>Items</h3>
            <p className="font-medium capitalize">2 Items (Shoes)</p>
          </div>
          <div>
            <h3>Services</h3>
            <div className="flex"></div>
            {invoice.items.map((item, index) => (
              <li key={item.id} className="font-medium capitalize">
                {item.name} : {item.service.map((s) => s.name).join(", ")}
              </li>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <h3 className="font-medium text-base">Order</h3>
        <Accordion
          type="single"
          collapsible
          defaultValue={cn("item-", 0)}
          className="border border-border rounded-md mt-1"
        >
          {invoice.items.map((item, index) => (
            <AccordionItem key={item.id} value={cn("item-", index)}>
              <AccordionTrigger className="p-2 flex items-center hover:underline-none">
                <div className="flex gap-3 items-center">
                  <div className="w-[50px] h-[50px]">
                    <Image
                      src="/images/shoe.jpeg"
                      alt="shoe photo"
                      width={50}
                      height={50}
                      className="bg-red-200 w-full h-full object-cover"
                    />
                  </div>
                  <div className="">
                    <h3 className="font-medium capitalize">{item.name}</h3>
                    <p className="font-normal">
                      Service: {item.service.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <Tabs defaultValue="tracking">
                  <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="tracking"
                      className="bg-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none"
                    >
                      Tracking
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="bg-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:shadow-none"
                    >
                      Details
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="tracking">
                    <TrackingMap
                      currentProgress={item.progress || Progress.NEW_ORDER}
                    />
                  </TabsContent>
                  <TabsContent value="details">
                    <DetailsNote
                      merk={item.name || "- - -"}
                      color={item.color || "- - -"}
                      materials={item.material || "- - -"}
                      size={item.size || "- - -"}
                      notes={item.note || "- - -"}
                    />
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Separator className="my-4" />
        <h3 className="font-medium text-base">Payment</h3>
        <div className=" mt-2">
          <div className="grid grid-cols-2 w-full gap-4">
            <div>
              <h3 className="font-medium">Service</h3>
              {serviceSummary.itemServices.map((service) => (
                <p key={service.serviceId}>
                  {service.service} ({service.qty}x)
                </p>
              ))}
              {/* <p>Deep Clean (1x)</p>
              <p>Regular Clean (1x)</p> */}
            </div>
            <div className="flex flex-col justify-end">
              {/* <p>{formatRupiah(serviceSummary.grandTotal)}</p> */}
              {serviceSummary.itemServices.map((service) => (
                <p key={service.serviceId}>{formatRupiah(service.total)}</p>
              ))}
              {/* <p>Rp 40.000</p>
              <p>Rp 35.000</p> */}
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4 mt-1">
            <div>
              <h3 className="font-medium">Discount</h3>
              {invoice.discounts?.map((discount, index) => (
                <p key={index}>{discount.title || `Discount ${index + 1}`}</p>
              ))}
              {(!invoice.discounts || invoice.discounts.length === 0) && (
                <p>-</p>
              )}
            </div>
            <div className="flex flex-col justify-end">
              {invoice.discounts?.map((discount, index) => (
                <p key={index}>
                  {typeof discount.amount === "object" &&
                  "toString" in discount.amount
                    ? parseFloat(discount.amount.toString())
                    : parseFloat(discount.amount as string)}
                  %
                </p>
              ))}
              {(!invoice.discounts || invoice.discounts.length === 0) && (
                <p>-</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4  mt-1">
            <h3 className="font-medium">Total</h3>
            <p className="font-medium">{formatRupiah(Number(invoice.price))}</p>
          </div>
          <div className="grid grid-cols-2 w-full gap-4  mt-1">
            <h3 className="font-medium">Payment Status</h3>
            <p>{invoice.paymentStatus}</p>
          </div>
          <div className="grid grid-cols-2 w-full gap-4  mt-1">
            <h3 className="font-medium">Payment Method</h3>
            <p>{invoice.paymentMethod}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <Card className="mt-4 p-2">
          <CardContent className="px-2  text-muted-foreground">
            <div className="sm:flex ">
              <span className="min-w-fit mr-1">Note : </span>
              <p className="text-justify">
                Apabila terdapat kesalahan pada nota harap lapor kepada Admin
                Wash & Care melalui WhatsApp.
                <br />
                Terimakasih telah menggunakan jasa Wash & Care.
              </p>
            </div>
            {/* <p>Terimakasih telah menggunakan jasa Wash & Care.</p> */}
          </CardContent>
        </Card>
        {/* Footer */}
        {/* <Separator className="my-4" /> */}
        <div className="mt-8 flex items-center justify-between ">
          <div className="">
            <span className="font-medium">Contact</span>
            <div className="flex flex-col gap-1 text-muted-foreground mt-1">
              <p>Phone : +62 812-3456-7890</p>
              <p>IG : @wnc.shoes</p>
              <p>
                Jl. Pundung, Nogotirto, Gamping, Sleman Daerah Istimewa
                Yogyakarta
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end text-end w-full">
            <Image
              src="/images/logo.jpg"
              alt="logo wnc"
              width={40}
              height={40}
            />
            <h2 className="font-medium">Wash & Care</h2>
            <p className="text-muted-foreground">
              We hope your shoes and apparel feel brand new. <br /> See you
              again soon!
            </p>
          </div>
        </div>
        <Separator className="mt-4 mb-2" />
        <p>© 2025 Wash & Care. All rights reserved.</p>
      </div>
    </div>
  );
}

export default NotePage;
