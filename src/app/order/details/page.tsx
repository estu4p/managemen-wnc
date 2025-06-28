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
  FormMessage,
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
import { Plus, Upload } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

const OrderDetailsPage = () => {
  const [totalItems, setTotalItems] = React.useState(1);
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
        <Button variant="default" size="sm" className="mb-3">
          Preview
        </Button>
      </div>
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer */}
            <div className="flex justify-between">
              <div className="w-[40%]">
                <h2 className="font-medium">Customer</h2>
                <p className="text-muted-foreground">Input Customer Data</p>
              </div>
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Customer Name
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
                        Customer Phone Number
                        <span className="text-red-700">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter customer phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Customer phone number has unique
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Order */}
            <div>
              <Separator className="my-2" />
              {/* <h2 className="font-medium">Order</h2>
              <p className="text-muted-foreground">Input Order</p> */}
              <div className="flex justify-between items-center w-[27%]">
                <div className="">
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
                  className="transition-all duration-300 ease-in-out transform space-y-4"
                  key={index}
                >
                  <div className="flex justify-between mt-2">
                    <div className="w-[40%]">
                      <h2 className="font-medium">Item 1</h2>
                    </div>
                    <div className="w-full space-y-4">
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
                                Category <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Item category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="shoes">Shoes</SelectItem>
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
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
            {/* Payment */}
            <div className="flex justify-between">
              <div className="w-[40%]">
                <h2 className="font-medium">Payment</h2>
                <p className="text-muted-foreground">Input Payment Details</p>
              </div>
              <div className="w-full space-y-4">
                <div className="grid gap-2">
                  <div className="flex gap-4 w-full">
                    <h3 className="font-medium w-full">Service</h3>
                    <h3 className="font-medium w-[10%]">Qty</h3>
                    <h3 className="font-medium w-full">Price</h3>
                  </div>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div className="flex gap-4 w-full">
                      <Input value="Deep clean" className="w-full" disabled />
                      <Input value="2" className="w-[10%]" disabled />
                      <Input value="Rp. 40,000" className="w-full" disabled />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 w-full items-start">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Add Discount</FormLabel>
                        <FormControl>
                          <Input placeholder="Add discount" />
                        </FormControl>
                        <FormDescription>
                          Add discount if the customer has a special discount.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <Label className="w-full">Total</Label>
                  {/* <Input value="Rp. 120,000" className="w-full" disabled /> */}
                  <div className="border border-border rounded-md py-2 px-3 w-full">
                    <h3 className="font-medium">Rp. 120,000</h3>
                  </div>
                </div>
                <div className="flex gap-4 w-full">
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
          </form>
        </Form>
        {/* <div className="flex justify-between">
          <div className="w-[35%]">
            <h2 className="font-medium">Customer</h2>
            <p className="text-muted-foreground">Input Customer Data</p>
          </div>
          <div className="flex flex-1 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="username" className="font-medium">
                Username
                <span className="text-red-700">*</span>{" "}
              </Label>
              <Input
                id="username"
                value=""
                placeholder="Customer Name"
                className="w-full"
              />
              <p className="text-muted-foreground">
                This username is used to login to your account.
              </p>
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="phone" className="font-medium">
                Phone
                <span className="text-red-700">*</span>{" "}
              </Label>
              <Input
                id="phone"
                value=""
                placeholder="Customer Name"
                className="w-full"
              />
              <p className="text-muted-foreground">
                This phone is used to login to your account.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
