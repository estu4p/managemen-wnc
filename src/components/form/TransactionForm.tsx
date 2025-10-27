"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { createTransaction, updateTransaction } from "@/lib/action";
import {
  transactionSchema,
  TransactionSchema,
} from "@/lib/formValidationSchemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TransactionFormProps = {
  mode: "create" | "update";
  defaultValues?: any;
};

const TransactionForm = ({
  mode = "create",
  defaultValues,
}: TransactionFormProps) => {
  const [isEditing, setIsEditing] = useState(mode === "create");

  const [state, formAction] = useActionState(
    mode === "create" ? createTransaction : updateTransaction,
    { success: false, error: false }
  );

  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues ?? {
      id: undefined,
      title: "",
      type: "",
      amount: undefined,
      category: "",
      notes: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Transaction has been ${mode === "create" ? "created" : "updated"}!`,
        {
          duration: 4000,
          position: "top-center",
          className: "font-semibold text-black",
          descriptionClassName: "text-black",
          richColors: true,
        }
      );
      router.refresh();
      setIsEditing(false);
    }
  }, [state, router, mode]);

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
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
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Title <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Transaction name"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Type <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Transaction category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Amount <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            {isEditing ? (
                              <Input
                                {...field}
                                placeholder="Transaction price"
                                type="number"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            ) : (
                              <Input
                                placeholder="Transaction price"
                                type="text"
                                value={
                                  field.value ? formatRupiah(field.value) : "0"
                                }
                                disabled
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Category <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Transaction category" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Notes"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
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
                        type="button"
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          type="button"
                          onClick={() => {
                            form.reset(defaultValues);
                            if (mode === "create") {
                              router.back();
                            } else {
                              setIsEditing(false);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer"
                          type="submit"
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

export default TransactionForm;
