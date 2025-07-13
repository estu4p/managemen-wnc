"use client";
import HeaderPage from "@/components/HeaderPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
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

const InventoryData = [
  {
    id: "detoxy",
    product: "Detoxy",
    category: "Soap",
    stock: "5 L",
  },
  {
    id: "sikatSuede",
    product: "Sikat Suede",
    category: "Brush",
    stock: "5 Pcs",
  },
  {
    id: "premiumCleaner",
    product: "Premium Cleaner",
    category: "Cleaning Solution",
    stock: "10 L",
  },
  {
    id: "mikrofiberTowel",
    product: "Mikrofiber Towel",
    category: "Cloth",
    stock: "20 Pcs",
  },
  {
    id: "cupSoleBrush",
    product: "Cup Sole Brush",
    category: "Brush",
    stock: "7 Pcs",
  },
  {
    id: "deodorizerSpray",
    product: "Deodorizer Spray",
    category: "Spray",
    stock: "12 Bottles",
  },
  {
    id: "shoeTree",
    product: "Shoe Tree",
    category: "Accessory",
    stock: "10 Pairs",
  },
  {
    id: "essentialKitBox",
    product: "Essential Kit Box",
    category: "Package",
    stock: "5 Boxes",
  },
];

const CustomerDetailsPage = () => {
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
  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-center justify-between">
        <HeaderPage
          title="Customer Details"
          desc="View and manage customer details"
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
            <div className="flex flex-col lg:flex-row">
              <div className="sm:w-[20%] lg:w-[30%]">
                <h2 className="font-medium">Customer</h2>
                <p className="text-muted-foreground">Customer Data</p>
              </div>
              <div className="max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
                <div className="space-y-6 sm:w-[70%] lg:w-full">
                  {/* <div className="sm:w-[50%] mt-4 sm:mt-0 flex items-center justify-center">
                <div className="flex flex-col lg:flex-row gap-4 w-full items-start"> */}
                  <div className="">
                    <h3 className="font-medium">Customer ID :</h3>
                    <h4 className="text-muted-foreground text-base">
                      #Wnc07253067
                    </h4>
                  </div>
                  <div className="flex gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer name"
                              value="Zlatan"
                              //   {...field}
                              disabled
                              className="font-medium"
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter customer phone number"
                              //   {...field}
                              value="087656765456"
                              disabled
                              className="font-medium"
                            />
                          </FormControl>
                          <FormDescription>
                            Phone number has unique
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-6 items-start">
                    <div>
                      <h3 className="font-medium mb-2">Photo Profile</h3>
                      <div className="flex gap-4">
                        <Avatar className="size-9">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>ES</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary-gray text-primary"
                          >
                            Edit photo profile
                          </Button>
                          <h4 className="text-muted-foreground">
                            Edit photo profile
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Orders */}
            <div>
              <Separator className="my-2" />
              <div className="flex flex-col sm:flex-row mt-4">
                <div className="sm:w-[20%] lg:w-[30%]">
                  <h2 className="font-medium">Orders</h2>
                  <p className="text-muted-foreground">
                    Customer order history
                  </p>
                </div>
                {/* <div className="w-[50%] space-y-6"> */}
                {/* <div className="sm:w-[50%] mt-4 sm:mt-0 flex items-center justify-center"></div> */}
                <div className="sm:w-[50%] mt-4 sm:mt-0 flex items-center justify-center">
                  {/* <div className="w-[95%] space-y-6"> */}
                  <div className="space-y-6 sm:w-[70%] lg:w-full">
                    <div className="grid grid-cols-2 gap-6 items-start">
                      <div className="space-y-2">
                        <Label>For Free</Label>
                        <div className="">
                          <p>4/5</p>
                          <Progress value={4 * 20} className="mt-1.5 h-1.5" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Total Order</Label>
                        <Input value="12" disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* History */}
            <div className="flex flex-col sm:flex-row mt-4">
              <div className="sm:w-[20%] lg:min-w-[30%]">
                <h2 className="font-medium">History</h2>
                <p className="text-muted-foreground">
                  Customer invoice history
                </p>
              </div>
              <div className="container mx-auto">
                <div className=" rounded-md border h-fit">
                  <Table>
                    <TableHeader className="bg-primary-gray">
                      <TableRow>
                        <TableHead className="text-primary">ID</TableHead>
                        <TableHead className="text-primary">
                          Total items
                        </TableHead>
                        <TableHead className="text-primary">
                          Total payment
                        </TableHead>
                        <TableHead className="text-primary">Date</TableHead>
                        <TableHead className="text-right text-primary"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {InventoryData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell className="text-right">
                            <Button size="iconXs">
                              <Link href={`/inventory/${item.id}`}>
                                <MoveUpRight />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    //   onClick={() => table.previousPage()}
                    //   disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    //   onClick={() => table.nextPage()}
                    //   disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
