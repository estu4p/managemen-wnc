"use client";
import PhotoInput from "@/components/photoInput";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { formatRupiah } from "@/lib/format";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

type ServiceSummary = {
  serviceId: number;
  service: string;
  qty: number;
  price: number;
  total: number;
};

const InvoiceForm = ({ invoice }: { invoice: any }) => {
  const [totalItems, setTotalItems] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  //   hitung service di item
  const itemServices: ServiceSummary[] = Object.values(
    invoice.items.reduce((acc: Record<number, ServiceSummary>, item: any) => {
      for (const srv of item.service) {
        const id = srv.id;

        if (!acc[id]) {
          acc[id] = {
            serviceId: id,
            service: srv.name,
            qty: 0,
            price: parseFloat(srv.price),
            total: 0,
          };
        }

        acc[id].qty += 1;
        acc[id].total = acc[id].qty * acc[id].price;
      }

      return acc;
    }, {})
  );

  //   Grand total
  const grandTotal = itemServices.reduce((sum, s) => sum + s.total, 0);
  // const discount = parseFloat(invoice.discount.discount ?? "0");
  const totalDiscountPercent = invoice.discounts.reduce(
    (sum: number, d: { discount: string }) => sum + parseFloat(d.discount),
    0
  );
  const discountValue = grandTotal * (totalDiscountPercent / 100);
  const finalDiscount = grandTotal - discountValue;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form Data:", data);
  }

  const handleTotalItem = () => {
    setTotalItems((prev) => prev + 1);
    // Reset the form for the new item
    form.reset({
      name: "",
      phone: "",
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer */}
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-[30%]">
            <h2 className="font-medium">Customer</h2>
            <p className="text-muted-foreground">Input Customer Data</p>
          </div>
          <div className="flex max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
            <div className="flex gap-6 items-start sm:w-[70%] lg:w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Name
                      <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter customer name"
                        value={invoice.customer.name}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>Customer name</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Phone Number
                      <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter customer phone number"
                        value={invoice.customer.phone}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>Phone number has unique</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {/* Order */}
        <div>
          <Separator className="my-2" />
          {/* <h2 className="font-medium">Order</h2>
              <p className="text-muted-foreground">Input Order</p> */}
          <div className="flex justify-between items-center lg:w-[27%]">
            <div className="mt-4 sm:mt-0">
              <h2 className="font-medium">Order</h2>
              <p className="text-muted-foreground">Input Order</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTotalItem}
              disabled={!isEditing}
            >
              <Plus />
              Add Item
            </Button>
          </div>
          {invoice.items.map((item: any, index: number) => (
            <div
              className="transition-all duration-300 ease-in-out transform space-y-4 mt-4 sm:mt-0"
              key={index}
            >
              <div className="flex flex-col sm:flex-row mt-2">
                <div className="w-[20%] lg:w-[30%]">
                  <h2 className="font-medium">Item {index + 1}</h2>
                </div>
                <div className="sm:w-[50%]  mt-2 sm:mt-0 flex items-center justify-center">
                  <div className="w-[95%] space-y-6">
                    <div className="flex gap-4 w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              Item Name <span className="text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter item name"
                                value={item.name}
                                disabled={!isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              Category <span className="text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={item.itemCategory}
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Item category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SHOE">Shoes</SelectItem>
                                  <SelectItem value="BAG">Bag</SelectItem>
                                  <SelectItem value="HELMET">Helmet</SelectItem>
                                  <SelectItem value="SANDAL">
                                    Saldals
                                  </SelectItem>
                                  <SelectItem value="HAT">Hat</SelectItem>
                                  <SelectItem value="WALLET">Wallet</SelectItem>
                                  <SelectItem value="OTHER">Others</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-4 w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Materials</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item materials"
                                value={item.material}
                                disabled={!isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item size"
                                value={item.size}
                                disabled={!isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Colors</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item colors"
                                value={item.color}
                                disabled={!isEditing}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* photos */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <PhotoInput />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Services<span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Deep Clean">
                                  Deep Clean
                                </SelectItem>
                                <SelectItem value="Regular Clean">
                                  regular Clean
                                </SelectItem>
                                <SelectItem value="One Day Service">
                                  One Day Service
                                </SelectItem>
                                <SelectItem value="Unyellowing Sole">
                                  Unyellowing Sole
                                </SelectItem>
                                <SelectItem value="Reglue Lite">
                                  Reglue Lite
                                </SelectItem>
                                <SelectItem value="Reglue Medium">
                                  Reglue Medium
                                </SelectItem>
                                <SelectItem value="Repaint">Repaint</SelectItem>
                                <SelectItem value="Recolour">
                                  Recolour
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add notes from the customer or if necessary"
                              rows={1}
                              value={item.note}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => {
                          if (totalItems > 1) {
                            setTotalItems((prev) => prev - 1);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
        {/* Payment */}
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-[20%] lg:w-[30%]">
            <h2 className="font-medium">Payment</h2>
            <p className="text-muted-foreground">Input Payment Details</p>
          </div>
          {/* <div className="w-[50%] space-y-6"> */}
          <div className="sm:w-[50%] mt-4 sm:mt-0 flex items-center justify-center">
            <div className="w-[95%] space-y-6">
              <div className="grid gap-2">
                <div className="flex gap-4 w-full">
                  <h3 className="font-medium w-full">Service</h3>
                  <h3 className="font-medium w-[10%]">Qty</h3>
                  <h3 className="font-medium w-full">Price</h3>
                </div>
                {itemServices.map((s, index) => (
                  <div key={index} className="flex gap-4 w-full">
                    <Input value={s.service} className="w-full" disabled />
                    <Input
                      value={s.qty}
                      className="w-[10%] p-0 text-center lg:px-3 lg:py-1 :"
                      disabled
                    />
                    <Input
                      value={formatRupiah(s.total)}
                      className="w-full"
                      disabled
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex gap-4 w-full items-start">
                  <h3 className="font-medium w-full">Discount Name</h3>
                  <h3 className="font-medium w-[10%]">Discount</h3>
                  <h3 className="font-medium w-full"></h3>
                </div>
                {invoice.discounts.map((discount: any) => (
                  <div
                    key={discount.id}
                    className="flex gap-4 w-full items-start"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-fit">
                          {/* <FormLabel>Discount Name</FormLabel> */}
                          <FormControl>
                            <Input
                              placeholder="Discount name"
                              value={discount.name}
                              disabled
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="">
                            {/* <FormLabel>Discount</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Discount"
                                value={discount.discount}
                                disabled
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-fit">
                            <FormControl>
                              <Select
                                defaultValue="nominal"
                                value={discount.type}
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="K" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NOMINAL">K</SelectItem>
                                  <SelectItem value="PERCENTAGE">%</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="sm">Add New Discount</Button>
              </div>
              <div className="flex gap-4 w-full">
                <Label className="w-full">Total</Label>
                {/* <Input value="Rp. 120,000" className="w-full" disabled /> */}
                <div className="border border-border rounded-md py-2 px-3 w-full">
                  <h3 className="font-medium">{formatRupiah(finalDiscount)}</h3>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <Label className="w-full">Payment Status</Label>
                <Select value={invoice.paymentStatus} disabled={!isEditing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID" defaultChecked>
                      UNPAID
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <Label className="w-full">Payment Method</Label>
                <Select value={invoice.paymentMethod} disabled={!isEditing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QRIS">Qris</SelectItem>
                    <SelectItem value="CASH" defaultChecked>
                      Cash
                    </SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes from the customer or if necessary"
                          rows={1}
                          value={invoice.note}
                          disabled={!isEditing}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mr-0 lg:mr-28">
          {!isEditing ? (
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                Cancle
              </Button>
              <Button variant="default" size="sm" className="cursor-pointer">
                Save
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
