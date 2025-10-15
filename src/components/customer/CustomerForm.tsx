"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { formatDate, formatRupiah, formatTime } from "@/lib/format";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

const statusLabels = {
  NEW_ORDER: "New Order",
  WAITTING: "Waiting",
  ON_PROGRESS: "On Progress",
  FINISHING: "Finishing",
  DONE: "Ready for Pick Up",
  PICKED_UP: "Picked Up",
  CANCELED: "Canceled",
};

// enum Progress {
//   NEW_ORDER
//   WAITTING
//   ON_PROGRESS
//   FINISHING
//   DONE
//   PICKED_UP
//   CANCELED
// }

const CustomerDetails = ({ customer }: { customer: any }) => {
  const [isEditing, setIsEditing] = useState(false);

  const totalItems = customer.invoices.reduce(
    (sum: any, inv: { _count: { items: any } }) => sum + inv._count.items,
    0
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("Form Data:", data);
  }
  return (
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
                    {customer.id}
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
                            value={customer.name}
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
                            value={customer.phone}
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
                        {customer.photo && <AvatarImage src={customer.photo} />}
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n: any[]) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
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
                <div className="flex justify-end gap-4">
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
                      >
                        Delete
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Save
                      </Button>
                    </>
                  )}
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
                <p className="text-muted-foreground">Customer order history</p>
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
                        <p>{totalItems}/5</p>
                        <Progress value={4 * 20} className="mt-1.5 h-1.5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Items</Label>
                      <Input value={totalItems} disabled />
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
              <p className="text-muted-foreground">Customer invoice history</p>
            </div>
            <div className="container mx-auto">
              <div className=" rounded-md border h-fit">
                <Table>
                  <TableHeader className="bg-primary-gray">
                    <TableRow>
                      <TableHead className="text-primary">Invoice ID</TableHead>
                      <TableHead className="text-primary">
                        Total Payment
                      </TableHead>
                      <TableHead className="text-primary">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-primary">Status</TableHead>
                      <TableHead className="w-[0px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.invoices.map((invoice: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{formatRupiah(invoice.price)}</TableCell>
                        <TableCell>
                          {formatDate(invoice.createdAt)}
                          <span className="text-muted-foreground">
                            {" "}
                            - {formatTime(invoice.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={invoice.progress as any}>
                            {statusLabels[
                              invoice.progress as keyof typeof statusLabels
                            ] || invoice.progress}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right w-fit">
                          <Button size="iconXs">
                            <Link href={`/invoices/${invoice.id}`}>
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
  );
};

export default CustomerDetails;
