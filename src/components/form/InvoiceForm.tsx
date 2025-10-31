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
import { Plus, SquarePen } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import {
  formatDate,
  formatPhoneNumber,
  formatRupiah,
  formatTime,
} from "@/lib/format";
import { updateInvoice } from "@/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceSchema } from "@/lib/formValidationSchemas";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Checkbox } from "../ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { calculateServiceSummary } from "@/lib/calculateServiceSummary";
import { uploadMultipleToCloudinary } from "@/lib/upload";

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

type Customer = {
  id: string;
  name: string;
  phone: string;
  photo: string;
  createdAt: Date;
};

const InvoiceForm = ({ mode, defaultValues }: InvoiceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customerIsEditing, setCustomerIsEditing] = useState(false);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [discountList, setDiscountList] = useState<any[]>([]);
  const [itemServices, setItemServices] = useState<ServiceSummary[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [selectedServices, setSelectedServices] = useState<{
    [itemIndex: number]: number[];
  }>({});
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
  const [openCustomersPhone, setOpenCustomersPhone] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchPhone, setSearchPhone] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [itemPhotos, setItemPhotos] = useState<{ [key: number]: File[] }>({});
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<{
    [key: number]: string[];
  }>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((resData) => setServiceList(resData));
  }, []);

  useEffect(() => {
    fetch("/api/discounts")
      .then((res) => res.json())
      .then((resData) => setDiscountList(resData));
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
      discounts: [],
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

  // Handlers untuk photos
  const handleItemPhotosChange = (itemIndex: number, files: File[]) => {
    setItemPhotos((prev) => ({
      ...prev,
      [itemIndex]: files,
    }));
  };

  const handleItemUrlsChange = (itemIndex: number, urls: string[]) => {
    setExistingPhotoUrls((prev) => ({
      ...prev,
      [itemIndex]: urls.filter((url) => !url.startsWith("blob:")),
    }));
  };

  const handleServiceChange = (
    itemIndex: number,
    selectedServiceIds: number[]
  ) => {
    setSelectedServices((prev) => ({
      ...prev,
      [itemIndex]: selectedServiceIds,
    }));

    // Update form value
    form.setValue(`items.${itemIndex}.service`, selectedServiceIds);
  };

  const handleDiscountChange = (discountIds: number[]) => {
    setSelectedDiscounts(discountIds);
    form.setValue("discounts", discountIds);
  };

  useEffect(() => {
    if (defaultValues?.discounts) {
      const initialDiscountIds = defaultValues.discounts.map((d: any) => d.id);
      setSelectedDiscounts(initialDiscountIds);
      form.setValue("discounts", initialDiscountIds);
    }
  }, [defaultValues?.discounts, form]);

  useEffect(() => {
    const result = calculateServiceSummary(
      selectedServices,
      serviceList,
      discountList,
      selectedDiscounts
    );

    setItemServices(result.itemServices);
    setGrandTotal(result.grandTotal);
    setFinalTotal(result.finalTotal);
  }, [selectedServices, serviceList, selectedDiscounts]);

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

  // handle add item
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

  // handle remove item
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

    // Juga hapus photos state untuk item yang dihapus
    setItemPhotos((prev) => {
      const newItemPhotos = { ...prev };
      delete newItemPhotos[index];
      return newItemPhotos;
    });

    setExistingPhotoUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[index];
      return newUrls;
    });
  };

  // search phone customer
  useEffect(() => {
    if (searchPhone.length < 3) {
      setOpenCustomersPhone(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/search?phone=${searchPhone}`);
        const data = await res.json();
        setCustomers(data);
        setOpenCustomersPhone(data.length > 0);
      } catch (error) {
        console.error(error);
      }
    };

    const timeout = setTimeout(fetchCustomer, 300);
    return () => clearTimeout(timeout);
  }, [searchPhone]);

  const handleSelectCustomer = (customer: any) => {
    form.setValue("customer.name", customer.name);
    form.setValue("customer.phone", customer.phone);
    toast.info(`Loaded ${customer.name}`, {
      position: "top-center",
    });
    setOpenCustomersPhone(false);
  };

  const [state, formAction, isPending] = useActionState(updateInvoice, {
    success: false,
    error: false,
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      if (!isEditing) return;

      setIsUploadingPhotos(true);

      try {
        const updatedItems = [];

        // Process each item
        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          const filesToUpload = itemPhotos[i] || [];

          let newPhotoUrls: string[] = [];

          // Upload new photos if any
          if (filesToUpload.length > 0) {
            const { urls, error } = await uploadMultipleToCloudinary(
              filesToUpload
            );
            if (error) {
              toast.error(`Failed to upload photos for item ${i + 1}`);
            } else {
              newPhotoUrls = urls;
              toast.success(`Uploaded ${urls.length} photos for item ${i + 1}`);
            }
          }

          // Combine existing and new photos
          const existingPhotos = item.photos || [];
          const existingUrlsFromState = existingPhotoUrls[i] || [];
          const allPhotos = [
            ...new Set([
              ...existingPhotos,
              ...existingUrlsFromState,
              ...newPhotoUrls,
            ]),
          ];

          updatedItems.push({
            ...item,
            photos: allPhotos,
          });
        }

        // Create final data
        const formDataWithPhotos = {
          ...data,
          items: updatedItems,
        };

        startTransition(() => {
          formAction(formDataWithPhotos);
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to process photos");
        setIsUploadingPhotos(false);
      }
    },
    (errors) => {
      console.error("Form errors:", errors);
      toast.error("Please check the form for errors", {
        duration: 4000,
        position: "top-center",
      });
      setIsUploadingPhotos(false);
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Invoice has been updated!", {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
        richColors: true,
      });

      router.refresh();
      setIsEditing(false);
      setIsUploadingPhotos(false);

      // Reset photo states setelah update berhasil
      setItemPhotos({});
      setExistingPhotoUrls({});
    }

    if (state.error) {
      toast.error(state.message ?? "Failed to update invoice!", {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
        richColors: true,
      });
      setIsUploadingPhotos(false);
    }
  }, [state]);

  // show share modal
  useEffect(() => {
    if (searchParams.get("share") === "true") {
      setShowDialog(true);
    }
  }, [searchParams]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* id */}
          <div className="text-base">
            <h2 className="font-medium">Invoice ID</h2>
            <span>#{defaultValues.id}</span>
          </div>
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
                disabled={!isEditing}
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
                        Phone Number <span className="text-red-700">*</span>
                      </FormLabel>

                      <div className="relative">
                        <Input
                          placeholder="Enter customer phone number"
                          autoComplete="off"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            setSearchPhone(value);
                          }}
                          disabled={!customerIsEditing}
                        />

                        {openCustomersPhone && customers.length > 0 && (
                          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md p-2">
                            <span className="text-[13px] text-muted-foreground">
                              Select if phone matches.
                            </span>
                            <Separator className="my-1" />
                            {customers.map((customer) => (
                              <div
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer)}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                <p className="font-semibold">
                                  {customer.phone}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {customer.name}
                                </p>
                                <Separator className="my-0.5" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <FormDescription>Phone number has unique</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {customerIsEditing && (
                <div className="mt-3 items-end flex justify-end gap-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    type="button"
                    onClick={() => {
                      form.reset(defaultValues);
                      setCustomerIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {/* end buton customer is edditing */}
            </div>
          </div>
          {/* Items */}
          <div>
            <Separator className="my-2" />
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
                                  Category{" "}
                                  <span className="text-red-700">*</span>
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
                          {/* <FormLabel>Photos</FormLabel> */}
                          <PhotoInput
                            onFilesChange={(files: File[]) =>
                              handleItemPhotosChange(index, files)
                            }
                            onUrlsChange={(urls: string[]) =>
                              handleItemUrlsChange(index, urls)
                            }
                            existingPhotos={
                              form.watch(`items.${index}.photos`) || []
                            }
                            itemIndex={index}
                            isUploading={isUploadingPhotos && isEditing}
                          />
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
                                        !field.value?.length &&
                                          "text-muted-foreground"
                                      )}
                                      disabled={!isEditing}
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
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.progress`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Progress</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value ?? ""}
                                  onValueChange={field.onChange}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Item progress" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="NEW_ORDER">
                                      New Order
                                    </SelectItem>
                                    <SelectItem value="WAITTING">
                                      Waitting
                                    </SelectItem>
                                    <SelectItem value="ON_PROGRESS">
                                      On Progress
                                    </SelectItem>
                                    <SelectItem value="FINISHING">
                                      Finishing
                                    </SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                    <SelectItem value="PICKED_UP">
                                      Picked Up
                                    </SelectItem>
                                    <SelectItem value="CANCELED">
                                      Canceled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                      <Input value={s.service} className="w-full" readOnly />
                      <Input
                        value={s.qty}
                        className="w-[10%] p-0 text-center lg:px-3 lg:py-1"
                        readOnly
                      />
                      <Input
                        value={formatRupiah(s.total)}
                        className="w-full"
                        readOnly
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
                    <h3 className="font-medium w-full">Discount</h3>
                  </div>
                  {selectedDiscounts.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No discounts selected
                    </div>
                  )}
                  {discountList
                    .filter((discount) =>
                      selectedDiscounts.includes(discount.id)
                    )
                    .map((discount) => (
                      <div
                        key={discount.id}
                        className="flex gap-4 w-full items-start"
                      >
                        <Input value={discount.name} readOnly />
                        <Input
                          value={
                            discount.type === "NOMINAL"
                              ? formatRupiah(discount.price)
                              : discount.price + "%"
                          }
                          readOnly
                        />
                      </div>
                    ))}
                </div>
                <div className="flex justify-end">
                  <FormField
                    control={form.control}
                    name="discounts"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Discounts</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger
                              className="flex justify-end w-fit"
                              asChild
                            >
                              <Button
                                size="sm"
                                type="button"
                                disabled={!isEditing}
                              >
                                Add Discount
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandGroup className="w-[380px]">
                                  <h3 className="text-sm font-medium ml-2 mt-2">
                                    Select Available Discounts
                                  </h3>
                                  <Separator className="my-2" />
                                  {discountList.map((discount) => {
                                    const isSelected = (
                                      field.value ?? []
                                    ).includes(discount.id);

                                    return (
                                      <CommandItem
                                        disabled={!isEditing}
                                        key={discount.id}
                                        onSelect={() => {
                                          const current: number[] =
                                            field.value ?? [];
                                          let newValue: number[];

                                          if (isSelected) {
                                            newValue = current.filter(
                                              (id) => id !== discount.id
                                            );
                                          } else {
                                            newValue = [
                                              ...current,
                                              discount.id,
                                            ];
                                          }

                                          field.onChange(newValue);
                                          handleDiscountChange(newValue);
                                        }}
                                      >
                                        <Checkbox
                                          checked={isSelected}
                                          className="mr-2"
                                        />
                                        {discount.name} -{" "}
                                        {formatRupiah(discount.price)}
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
                </div>
                <div className="flex gap-4 w-full">
                  <Label className="w-full">Total</Label>
                  <input
                    type="hidden"
                    value={finalTotal}
                    name="price"
                    onChange={(e) => e.target.value}
                  />
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                  disabled={isPending || isUploadingPhotos}
                  className="cursor-pointer disabled:opacity-50"
                  type="button"
                  onClick={() => {
                    form.reset(defaultValues);
                    setIsEditing(false);
                    setCustomerIsEditing(false);
                    setIsUploadingPhotos(false);

                    // Reset selected services
                    const initialSelectedServices: {
                      [itemIndex: number]: number[];
                    } = {};
                    fields.forEach((_, index) => {
                      const serviceValue =
                        defaultValues?.items?.[index]?.service;
                      if (serviceValue && Array.isArray(serviceValue)) {
                        initialSelectedServices[index] = serviceValue;
                      }
                    });
                    setSelectedServices(initialSelectedServices);

                    // Reset photo states
                    setItemPhotos({});
                    setExistingPhotoUrls({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isPending || isUploadingPhotos}
                >
                  {isPending || isUploadingPhotos ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {isUploadingPhotos
                        ? "Uploading Photos..."
                        : "Updating..."}
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
      {/* share modal */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Share Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            The invoice has been created and saved.{" "}
            <span className="font-semibold">
              Share the invoice with the customer!
            </span>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const invoiceNumber = form.watch("id");
                const phone = form.watch("customer.phone");
                const phoneNumber = formatPhoneNumber(phone);
                const customerName = form.watch("customer.name");
                const createdAt = defaultValues?.createdAt ?? Date.now();
                const incomingDate = formatDate(createdAt);
                const incomingTime = formatTime(createdAt);
                const totalPrice = finalTotal;
                const items = form.watch("items");
                const totalItem = form.watch("items").length;
                const note = form.watch("note") ?? "-";

                let serviceMessage = "";
                items.forEach((item: any) => {
                  serviceMessage += `- ${item.name}`;
                  if (item.serviceDetail && item.serviceDetail.length > 0) {
                    serviceMessage += `: ${item.serviceDetail
                      .map((s: any) => s.name)
                      .join(", ")}`;
                  }
                });
                const paymentMethod = form.watch("paymentMethod");
                const paymentStatus = form.watch("paymentStatus");
                const message = `
*INVOICE DIGITAL - TRANSAKSI REGULER*

*Wash and Care*
Nogotirto, Gamping, Sleman, DIY
📞 087852916445

=================
*Nomor Nota:* ${invoiceNumber}
*Pelanggan:* cs ${customerName}

*Tanggal Terima:* ${incomingDate} | ${incomingTime}
*Tanggal Selesai:* 11/10/2022 16:40
=================

*Detail Pesanan:*
Orderan (Jumlah) : ${totalItem} Item
Layanan :
${serviceMessage}
Ket: ${note}

=================
*Detail Biaya:*
Total Tagihan : ${totalPrice}  
Grand Total : ${totalPrice}  

*Status:* ${paymentStatus}
*Pembayaran:* ${paymentMethod}
=================

*Lihat proses dan detail pesanan Anda :*
http://localhost:3000/order-tracking/${invoiceNumber}

 *Syarat dan Ketentuan:*
1. Pengambilan barang harap disertai nota  
2. Barang tidak diambil >1 bulan → hilang/rusak tidak diganti  
3. Barang rusak karena proses pengerjaan diganti max 5x biaya  
4. Klaim luntur di luar tanggungan  
5. Hak klaim berlaku 2 jam setelah barang diambil  
6. Konsumen dianggap setuju dengan perhitungan di atas

Terima kasih telah mempercayakan perawatan sepatu Anda di *Wash and Care*
`;
                const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`;

                window.open(whatsAppUrl, "_blank");
                setShowDialog(false);
              }}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvoiceForm;
