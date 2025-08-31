"use client";

import PhotoInput from "@/components/photoInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

// type Transaction = {
//   name: string;
//   category: string;
//   price: number;
//   unit: string;
//   initialStock: number;
//   currentStock: number;
// };

const TransactionDetails = ({ transaction }: { transaction: any }) => {
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="transition-all duration-300 ease-in-out transform space-y-4 mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row mt-2">
              <div className="w-full lg:w-[30%]">
                <h2 className="font-medium text-base">Transaction Data</h2>
              </div>
              <div className="max-sm:w-[95%] lg:w-[50%] mt-4 sm:mt-0 flex max-lg:items-center max-lg:justify-center">
                <div className="space-y-6 w-full">
                  <div className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Name <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Inventory name"
                              {...field}
                              value={transaction.name}
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
                            Type <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={transaction.type}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Inventory category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Amount"
                              {...field}
                              value={formatRupiah(transaction.amount)}
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
                              value={transaction.category}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Inventory category" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Income */}
                                <SelectItem value="SERVICE_INCOME">
                                  Service Income
                                </SelectItem>
                                <SelectItem value="PRODUCT_SALES">
                                  Product Sales
                                </SelectItem>
                                <SelectItem value="OTHER_INCOME">
                                  Other Income
                                </SelectItem>

                                {/* Expense */}
                                <SelectItem value="MATERIAL_PURCHASE">
                                  Material Purchase
                                </SelectItem>
                                <SelectItem value="EQUIPMENT_PURCHASE">
                                  Equipment Purchase
                                </SelectItem>
                                <SelectItem value="SALARY">Salary</SelectItem>
                                <SelectItem value="RENT">Rent</SelectItem>
                                <SelectItem value="UTILITY">Utility</SelectItem>
                                <SelectItem value="MARKETING">
                                  Marketing
                                </SelectItem>
                                <SelectItem value="OTHER_EXPENSE">
                                  Other Expense
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Notes"
                                  {...field}
                                  value={transaction.description}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    />
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TransactionDetails;
