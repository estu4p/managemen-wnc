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
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { createInvoice } from "@/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceSchema } from "@/lib/formValidationSchemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { calculateServiceSummary } from "@/lib/calculateServiceSummary";

type ServiceSummary = {
  serviceId: number;
  service: string;
  qty: number;
  price: number;
  total: number;
};

type InvoiceFormProps = {
  defaultValues?: any;
};

const NewInvoiceForm = ({ defaultValues }: InvoiceFormProps) => {
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [itemServices, setItemServices] = useState<ServiceSummary[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [selectedServices, setSelectedServices] = useState<{
    [itemIndex: number]: number[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [state, formAction] = useActionState(createInvoice, {
    success: false,
    error: false,
  });

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((resData) => setServiceList(resData));
  }, []);

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

  const handleServiceChange = (
    itemIndex: number,
    selectedServiceIds: number[]
  ) => {
    setSelectedServices((prev) => ({
      ...prev,
      [itemIndex]: selectedServiceIds,
    }));

    form.setValue(`items.${itemIndex}.service`, selectedServiceIds);
  };

  useEffect(() => {
    const result = calculateServiceSummary(
      selectedServices,
      serviceList,
      defaultValues?.discounts
    );

    setItemServices(result.itemServices);
    setGrandTotal(result.grandTotal);
    setFinalTotal(result.finalTotal);
  }, [selectedServices, serviceList, defaultValues?.discounts]);

  useEffect(() => {
    const initialSelectedServices: { [itemIndex: number]: number[] } = {};

    fields.forEach((_, index) => {
      const serviceValue = form.getValues(`items.${index}.service`);
      if (serviceValue && Array.isArray(serviceValue)) {
        initialSelectedServices[index] = serviceValue;
      }
    });

    setSelectedServices(initialSelectedServices);
  }, [fields, form]);

  useEffect(() => {
    form.setValue("price", finalTotal);
  }, [finalTotal, form]);

  const handleAppendItem = () => {
    const newIndex = fields.length;
    append({
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
    });
    setSelectedServices((prev) => ({
      ...prev,
      [newIndex]: [],
    }));
  };

  const handleRemoveItem = (index: number) => {
    remove(index);

    setSelectedServices((prev) => {
      const newSelectedServices = { ...prev };
      delete newSelectedServices[index];

      const reindexed: { [key: number]: number[] } = {};
      Object.keys(newSelectedServices).forEach((key) => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newSelectedServices[oldIndex];
        } else {
          reindexed[oldIndex] = newSelectedServices[oldIndex];
        }
      });

      return reindexed;
    });
  };

  useEffect(() => {
    if (state.success) {
      toast.success("Invoice has been created successfully!", {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
      });

      setTimeout(() => {
        router.push(`/invoices/${state.invoiceId}?share=true`);
      }, 1000);
    }
  }, [state, form, router]);

  const onSubmit = form.handleSubmit(
    (data) => {
      setIsLoading(true);
      startTransition(() => {
        formAction(data);
        setIsLoading(false);
      });
    },
    (errors) => {
      toast.error("Please check the form for errors", {
        duration: 4000,
        position: "top-center",
      });
    }
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4" method="POST">
          {/* Customer */}
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[30%] flex justify-between">
              <div className="">
                <h2 className="font-medium">Customer</h2>
                <p className="text-muted-foreground">Input Customer Data</p>
              </div>
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
                        <Input placeholder="Enter customer name" {...field} />
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
                        />
                      </FormControl>
                      <FormDescription>Phone number has unique</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center lg:w-[27%]">
              <div className="mt-4 sm:mt-0">
                <h2 className="font-medium">Item</h2>
                <p className="text-muted-foreground">Input Item</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                type="button"
                onClick={handleAppendItem}
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
                                  Category{" "}
                                  <span className="text-red-700">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Item category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="SHOE">
                                        Shoes
                                      </SelectItem>
                                      <SelectItem value="BAG">Bag</SelectItem>
                                      <SelectItem value="HELMET">
                                        Helmet
                                      </SelectItem>
                                      <SelectItem value="SANDAL">
                                        Sandals
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
                                      className="w-full justify-between"
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
                                              key={service.id}
                                              onSelect={() => {
                                                const current: number[] =
                                                  field.value ?? [];
                                                let newValue: number[];

                                                if (isSelected) {
                                                  newValue = current.filter(
                                                    (id) => id !== service.id
                                                  );
                                                } else {
                                                  newValue = [
                                                    ...current,
                                                    service.id,
                                                  ];
                                                }

                                                // Update form value dan selected services
                                                field.onChange(newValue);
                                                handleServiceChange(
                                                  index,
                                                  newValue
                                                );
                                              }}
                                            >
                                              <Checkbox
                                                checked={isSelected}
                                                className="mr-2"
                                              />
                                              {service.name} -{" "}
                                              {formatRupiah(service.price)}
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
                            onClick={() => handleRemoveItem(index)}
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
                        className="w-[10%] p-0 text-center lg:px-3 lg:py-1"
                        disabled
                      />
                      <Input
                        value={formatRupiah(s.total)}
                        className="w-full"
                        disabled
                      />
                    </div>
                  ))}
                  {itemServices.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No services selected
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-4 w-full items-start">
                    <h3 className="font-medium w-full">Discount Name</h3>
                    <h3 className="font-medium w-[10%]">Discount</h3>
                    <h3 className="font-medium w-full"></h3>
                  </div>
                  {defaultValues?.discounts?.map((discount: any) => (
                    <div
                      key={discount.id}
                      className="flex gap-4 w-full items-start"
                    >
                      <FormItem className="w-fit">
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
                  <div className="border border-border rounded-md py-2 px-3 w-full">
                    <h3 className="font-medium">
                      {formatRupiah(finalTotal) ?? "Rp 0"}
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
                        >
                          <SelectTrigger className="w-full lg:w-1/2">
                            <SelectValue placeholder="Select Payment Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PAID">PAID</SelectItem>
                            <SelectItem value="UNPAID">UNPAID</SelectItem>
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
                        >
                          <SelectTrigger className="w-full lg:w-1/2">
                            <SelectValue placeholder="Select Payment Method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="QRIS">QRIS</SelectItem>
                            <SelectItem value="CASH">CASH</SelectItem>
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
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              type="button"
              onClick={() => {
                form.reset(defaultValues);
                setSelectedServices({});
                setItemServices([]);
                setGrandTotal(0);
                setFinalTotal(0);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default NewInvoiceForm;
