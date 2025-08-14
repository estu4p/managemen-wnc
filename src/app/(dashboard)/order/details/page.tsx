"use client";
import PhotoInput from "@/components/photoInput";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

function OrderDetailsPage() {
  const [totalItems, setTotalItems] = useState(1);
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
                          <Input placeholder="Enter customer name" {...field} />
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
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Phone number has unique
                        </FormDescription>
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
                <Button variant="outline" size="sm" onClick={handleTotalItem}>
                  <Plus />
                  Add Item
                </Button>
              </div>
              {Array.from({ length: totalItems }).map((_, index) => (
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
                                  Item Name{" "}
                                  <span className="text-red-700">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter item name"
                                    {...field}
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
                                  Category{" "}
                                  <span className="text-red-700">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Item category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="shoes">
                                        Shoes
                                      </SelectItem>
                                      <SelectItem value="bag">Bag</SelectItem>
                                      <SelectItem value="helmet">
                                        Helmet
                                      </SelectItem>
                                      <SelectItem value="sandals">
                                        Saldals
                                      </SelectItem>
                                      <SelectItem value="hat">Hat</SelectItem>
                                      <SelectItem value="others">
                                        Others
                                      </SelectItem>
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
                                    {...field}
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
                                  <Input placeholder="Item size" {...field} />
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
                                  <Input placeholder="Item colors" {...field} />
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
                                    <SelectItem value="Repaint">
                                      Repaint
                                    </SelectItem>
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
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="flex gap-4 w-full">
                        <Input value="Deep clean" className="w-full" disabled />
                        <Input
                          value="2"
                          className="w-[10%] p-0 text-center lg:px-3 lg:py-1 :"
                          disabled
                        />
                        <Input value="Rp. 40,000" className="w-full" disabled />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-">
                          <FormLabel>Select Discount</FormLabel>
                          <FormControl>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a discount" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="discount1">
                                  Ramadhan Sale
                                </SelectItem>
                                <SelectItem value="discount2">
                                  Cuci 2 gratis 1
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                            <FormLabel>Add Discount</FormLabel>
                            <FormControl>
                              <Input placeholder="Add discount" />
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
                              <Select defaultValue="nominal">
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="K" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="nominal">K</SelectItem>
                                  <SelectItem value="percentage">%</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 w-full">
                    <Label className="w-full">Total</Label>
                    {/* <Input value="Rp. 120,000" className="w-full" disabled /> */}
                    <div className="border border-border rounded-md py-2 px-3 w-full">
                      <h3 className="font-medium">Rp. 120,000</h3>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 w-full">
                    <Label className="w-full">Payment Method</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Payment Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid" defaultChecked>
                          Unpaid
                        </SelectItem>
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
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
