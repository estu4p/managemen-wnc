"use client";
import PhotoInput from "@/components/photoInput";
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
import { ChevronsUpDown, Plus, SquarePen } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { createInvoice, updateInvoice } from "@/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceSchema } from "@/lib/formValidationSchemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DialogDelete from "./DialogDelete";

type ServiceSummary = {
  serviceId: number;
  service: string;
  qty: number;
  price: number;
  total: number;
};

type InvoiceFormProps = {
  mode: "create" | "update";
  defaultValues?: any;
};

const InvoiceForm = ({ mode, defaultValues }: InvoiceFormProps) => {
  const [totalItems, setTotalItems] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [customerIsEditing, setCustomerIsEditing] = useState(false);
  const [serviceList, setServiceList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((resData) => setServiceList(resData));
  }, []);

  // hitung service di item
  const itemServices: ServiceSummary[] = Object.values(
    defaultValues.items.reduce(
      (acc: Record<number, ServiceSummary>, item: any) => {
        // pastikan service selalu array of object
        const services = item.service.map((srv: any) =>
          typeof srv === "number"
            ? serviceList.find((s) => s.id === srv) // ambil detail dari daftar service global
            : srv
        );

        for (const srv of services) {
          if (!srv) continue; // skip kalau tidak ketemu

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
      },
      {}
    )
  );

  //   Grand total
  const grandTotal = itemServices.reduce((sum, s) => sum + s.total, 0);

  // total diskon (anggap semua diskon persentase)
  const totalDiscountPercent =
    defaultValues.discounts?.reduce(
      (sum: number, d: { amount: string }) => sum + parseFloat(d.amount),
      0
    ) ?? 0;

  const discountValue = grandTotal * (totalDiscountPercent / 100);
  const finalTotal = grandTotal - discountValue;

  const [state, formAction] = useActionState(
    mode === "create" ? createInvoice : updateInvoice,
    {
      success: false,
      error: false,
    }
  );

  const form = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultValues ?? {
      id: undefined,
      price: 0,
      addDiscount: undefined,
      note: "",
      progress: "NEW_ORDER",
      paymentStatus: "UNPAID",
      paymentMethod: "CASH",
      customer: {
        id: undefined,
        name: "",
        phone: "",
        photo: "",
      },
      items: [
        {
          id: undefined,
          name: "",
          itemCategory: "SHOE",
          material: "",
          size: "",
          color: "",
          photos: [],
          note: "",
          estimatedCompletion: undefined,
          progress: "NEW_ORDER",
          service: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    startTransition(async () => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Invoice has been ${mode === "create" ? "created" : "updated"}!`, {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
      });
      router.refresh();
      setIsEditing(false);
    }
  }, [state, mode]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" method="post">
        {/* Customer */}
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-[30%] flex justify-between">
            <div className="">
              <h2 className="font-medium">Customer</h2>
              <p className="text-muted-foreground">Input Customer Data</p>
            </div>
            <Button
              size="iconXs"
              className="cursor-pointer mr-4"
              type="button"
              onClick={() => setCustomerIsEditing(true)}
            >
              <SquarePen />
            </Button>
          </div>
          {/* Customer */}
          <div className="max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
            <div className="flex gap-6 items-start sm:w-[70%] lg:w-full">
              <FormField
                control={form.control}
                name="customer.name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Name
                      <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter customer name"
                        {...field}
                        disabled={!customerIsEditing}
                      />
                    </FormControl>
                    <FormDescription>Customer name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer.phone"
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
                        disabled={!customerIsEditing}
                      />
                    </FormControl>
                    <FormDescription>Phone number has unique</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* buton customer is edditing */}
            {customerIsEditing && (
              <div className="mt-3 items-end flex justify-end gap-4">
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => {
                    (defaultValues.customer.name =
                      defaultValues.customer.name ?? ""),
                      (defaultValues.customer.phone =
                        defaultValues.customer.phone ?? ""),
                      setCustomerIsEditing(false);
                  }}
                >
                  Cancle
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => setCustomerIsEditing(false)}
                >
                  Save
                </Button>
              </div>
            )}
            {/* end buton customer is edditing */}
          </div>
        </div>
        {/* Items */}
        <div>
          <Separator className="my-2" />
          {/* <h2 className="font-medium">Order</h2>
              <p className="text-muted-foreground">Input Order</p> */}
          <div className="flex justify-between items-center lg:w-[27%]">
            <div className="mt-4 sm:mt-0">
              <h2 className="font-medium">Item</h2>
              <p className="text-muted-foreground">
                {mode === "create" ? "Input Item" : "Update Item"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              type="button"
              disabled={!isEditing}
              onClick={() =>
                append({ name: "", itemCategory: "SHOE", service: [] })
              }
            >
              <Plus />
              Add Item
            </Button>
          </div>
          {fields.map((field, index) => {
            const itemId = form.getValues(`items.${index}.id`);
            return (
              <div
                className="transition-all duration-300 ease-in-out transform space-y-4 mt-4 sm:mt-0"
                key={field.id}
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
                          name={`items.${index}.name`}
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
                                  value={field.value ?? ""}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemCategory`}
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
                                    <SelectValue placeholder="Item category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SHOE">Shoes</SelectItem>
                                    <SelectItem value="BAG">Bag</SelectItem>
                                    <SelectItem value="HELMET">
                                      Helmet
                                    </SelectItem>
                                    <SelectItem value="SANDAL">
                                      Saldals
                                    </SelectItem>
                                    <SelectItem value="HAT">Hat</SelectItem>
                                    <SelectItem value="WALLET">
                                      Wallet
                                    </SelectItem>
                                    <SelectItem value="OTHER">
                                      Others
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex gap-4 w-full">
                        <FormField
                          control={form.control}
                          name={`items.${index}.material`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Materials</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Item materials"
                                  {...field}
                                  value={field.value ?? ""}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.size`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Size</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Item size"
                                  {...field}
                                  value={field.value ?? ""}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.color`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Colors</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Item colors"
                                  {...field}
                                  value={field.value ?? ""}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* photos */}

                      <FormItem>
                        <PhotoInput />
                        {/* <FormMessage /> */}
                      </FormItem>

                      <FormField
                        control={form.control}
                        name={`items.${index}.service`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>
                              Services <span className="text-red-700">*</span>
                            </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value?.length ||
                                        (!isEditing && "text-muted-foreground")
                                    )}
                                  >
                                    {field.value?.length
                                      ? serviceList
                                          .filter((s) =>
                                            field.value.includes(s.id)
                                          )
                                          .map((s) => s.name)
                                          .join(", ")
                                      : "Select services..."}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandGroup className="w-[380px]">
                                      <h3 className="text-sm font-medium ml-2 mt-2">
                                        Select Service List
                                      </h3>
                                      <Separator className="my-2" />
                                      {serviceList.map((service) => {
                                        const isSelected =
                                          field.value?.includes(service.id);

                                        return (
                                          <CommandItem
                                            disabled={!isEditing}
                                            key={service.id}
                                            onSelect={() => {
                                              const current: number[] =
                                                field.value ?? [];
                                              if (isSelected) {
                                                field.onChange(
                                                  current.filter(
                                                    (id) => id !== service.id
                                                  )
                                                );
                                              } else {
                                                field.onChange([
                                                  ...current,
                                                  service.id,
                                                ]);
                                              }
                                            }}
                                          >
                                            <Checkbox
                                              checked={isSelected}
                                              className="mr-2"
                                            />
                                            {service.name}
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.note`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add notes from the customer or if necessary"
                                rows={1}
                                {...field}
                                value={field.value ?? ""}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          disabled={!isEditing}
                          onClick={() => remove(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            );
          })}
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
                {defaultValues.discounts.map((discount: any) => (
                  <div
                    key={discount.id}
                    className="flex gap-4 w-full items-start"
                  >
                    <FormItem className="w-fit">
                      {/* <FormLabel>Discount Name</FormLabel> */}
                      <FormControl>
                        <Input
                          placeholder="Discount name"
                          value={discount.title}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <div className="flex items-end gap-2">
                      <FormItem className="">
                        {/* <FormLabel>Discount</FormLabel> */}
                        <FormControl>
                          <Input
                            placeholder="Discount"
                            value={discount.amount}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

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
                        <FormMessage />
                      </FormItem>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button size="sm" type="button">
                  Add New Discount
                </Button>
              </div>

              <div className="flex gap-4 w-full">
                <Label className="w-full">Total</Label>
                {/* <Input value="Rp. 120,000" className="w-full" disabled /> */}
                <div className="border border-border rounded-md py-2 px-3 w-full">
                  <h3 className="font-medium">
                    {formatRupiah(finalTotal) ?? ""}
                  </h3>
                </div>
              </div>
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 w-full justify-between">
                    <FormLabel>Payment Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full lg:w-1/2">
                          <SelectValue placeholder="Select Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAID">PAID</SelectItem>
                          <SelectItem value="UNPAID" defaultChecked>
                            UNPAID
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 w-full justify-between">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full lg:w-1/2">
                          <SelectValue placeholder="Select Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QRIS">QRIS</SelectItem>
                          <SelectItem value="CASH" defaultChecked>
                            CASH
                          </SelectItem>
                          <SelectItem value="TRANSFER">TRANSFER</SelectItem>
                          <SelectItem value="DEBIT">DEBIT</SelectItem>
                          <SelectItem value="OTHER">OTHER</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes from the customer or if necessary"
                        rows={1}
                        {...field}
                        value={field.value ?? ""}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mr-0 lg:mr-28">
          {!isEditing ? (
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer"
              type="button"
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
                type="button"
                onClick={() => {
                  form.reset(defaultValues);
                  setIsEditing(false);
                }}
              >
                Cancle
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
      </form>
    </Form>
  );
};

export default InvoiceForm;
