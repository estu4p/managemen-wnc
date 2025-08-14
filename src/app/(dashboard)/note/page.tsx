import DetailsNote from "@/components/note/NoteDetails";
import { TrackingMap } from "@/components/note/TrackingMap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note } from "@/lib/notes";
import { cn } from "@/lib/utils";
import Image from "next/image";

const order = [
  {
    id: 1,
    category: "shoes",
    name: "Nike Air Max 270",
    material: "Leather",
    color: "White, Red",
    size: "42",
    photoBefore: [
      "/images/shoe.jpeg",
      "/images/shoe.jpeg",
      "/images/shoe.jpeg",
    ],
    service: "Deep Clean",
    notes: "Kotor, bau, dan berjamur",
    status: 3,
  },
  {
    id: 1,
    category: "shoes",
    name: "Adidas Samba",
    material: "Suede",
    color: "Biru, Putih",
    size: "41",
    image: "/images/shoe.png",
    service: "Unyellowing Sole",
    notes: "-",
    status: 4,
  },
];

interface NotePreviewProps {
  note: Note;
}

function NotePage({ note }: NotePreviewProps) {
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
            <p className="font-medium capitalize">
              {note.customer.name || "- - -"}
            </p>
          </div>
          <div>
            <h3>Order ID</h3>
            <p className="font-medium">{note.id || "- - -"}</p>
          </div>
          <div>
            <h3>Incoming Order</h3>
            <p className="font-medium">13.29 | 01-05-2025</p>
          </div>
          <div>
            <h3>Estimated Completion</h3>
            <p className="font-medium">2023-10-01</p>
          </div>
          <div>
            <h3>Items</h3>
            <p className="font-medium capitalize">2 Items (Shoes)</p>
          </div>
          <div>
            <h3>Services</h3>
            <div className="flex"></div>
            {note.items.map((item, index) => (
              <span key={item.id} className="font-medium capitalize bg-red-200">
                {item.service}
                {index < note.items.length - 1 ? ", " : ""}
              </span>
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
          {note.items.map((item, index) => (
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
                    <h3 className="font-medium capitalize">
                      {item.name || "- - -"}
                    </h3>
                    <p className="font-normal">
                      Service: {item.service || "- - -"}
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
                    <TrackingMap />
                  </TabsContent>
                  <TabsContent value="details">
                    <DetailsNote
                      merk={item.name || "- - -"}
                      color={item.color || "- - -"}
                      materials={item.material || "- - -"}
                      size={item.size || "- - -"}
                      notes={item.notes || "- - -"}
                    />
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
          {/* <AccordionItem value="item-2">
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
                  <h3 className="font-medium ">Nike Air 3</h3>
                  <p className="font-normal">Deep Clean</p>
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
                <TabsContent value="tracking">Track your order</TabsContent>
                <TabsContent value="details">
                  Show your order details
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
        <Separator className="my-4" />
        <h3 className="font-medium text-base">Payment</h3>
        <div className=" mt-2">
          <div className="grid grid-cols-2 w-full gap-4">
            <div>
              <h3 className="font-medium">Subtotal</h3>
              <p>Deep Clean (1x)</p>
              <p>Regular Clean (1x)</p>
            </div>
            <div className="flex flex-col justify-end">
              <p>Rp 40.000</p>
              <p>Rp 35.000</p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4 mt-1">
            <div>
              <h3 className="font-medium">Discount</h3>
              <p>Ramadhan Sale</p>
            </div>
            <div className="flex flex-col justify-end">
              <p>20%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-4  mt-1">
            <h3 className="font-medium">Total</h3>
            <p className="font-medium">Rp 60.000</p>
          </div>
          <div className="grid grid-cols-2 w-full gap-4  mt-1">
            <h3 className="font-medium">Payment Status</h3>
            <p>Unpaid</p> {/* Paid / Unpaid / Partial (Rp ...) */}
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
