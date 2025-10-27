"use client";

import PhotoInput from "@/components/photoInput";
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
import { createInventory, updateInventory } from "@/lib/action";
import { formatRupiah } from "@/lib/format";
import { inventorySchema, InventorySchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

// type Inventory = {
//   name: string;
//   category: string;
//   price: number;
//   unit: string;
//   initialStock: number;
//   currentStock: number;
// };
type InventoryFormProps = {
  mode: "create" | "update";
  defaultValues?: any;
};

const InventoryForm = ({ mode, defaultValues }: InventoryFormProps) => {
  const [isEditing, setIsEditing] = useState(mode === "create");

  const [state, formAction] = useActionState(
    mode === "create" ? createInventory : updateInventory,
    { success: false, error: false }
  );

  const form = useForm<InventorySchema>({
    resolver: zodResolver(inventorySchema),
    defaultValues: defaultValues ?? {
      id: undefined,
      name: "",
      category: "",
      unit: "OTHER",
      initialStock: undefined,
      currentStock: undefined,
      price: undefined,
      photo: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Inventory has been ${mode === "create" ? "created" : "updated"}!`,
        {
          duration: 4000,
          position: "top-center",
          className: "font-semibold text-black",
          descriptionClassName: "text-black",
          richColors: true,
        }
      );
      router.push("/inventories");
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
                <h2 className="font-medium text-base">Inventory Data</h2>
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
                              disabled={!isEditing}
                            />
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
                                <SelectValue placeholder="Inventory category" />
                              </SelectTrigger>
                              <SelectContent id="category">
                                <SelectItem value="EQUIPMENT">
                                  Equipment
                                </SelectItem>
                                <SelectItem value="MATERIAL">
                                  Material
                                </SelectItem>
                                <SelectItem value="PRODUCT">Product</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="items-start">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            {isEditing ? (
                              <Input
                                {...field}
                                placeholder="Inventory price"
                                type="number"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            ) : (
                              <Input
                                placeholder="Inventory price"
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
                  </div>
                  <div className="flex gap-4 items-end">
                    {/* <div className="flex gap-2 items-end w-full"> */}
                    <FormField
                      control={form.control}
                      name="initialStock"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Initial Stock</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Input discount amount"
                              {...field}
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              name="unit"
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-fit">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PCS">PCS</SelectItem>
                                <SelectItem value="LITER">LITER</SelectItem>
                                <SelectItem value="GRAM">GRAM</SelectItem>
                                <SelectItem value="METER">METER</SelectItem>
                                <SelectItem value="PAIRS">PAIRS</SelectItem>
                                <SelectItem value="BOX">BOX</SelectItem>
                                <SelectItem value="ROLL">ROLL</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* </div> */}
                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Input discount amount"
                              {...field}
                              type="number"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <PhotoInput />
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

export default InventoryForm;
