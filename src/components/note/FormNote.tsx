import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import React, { useState } from "react";
import { Note } from "@/lib/notes";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
// });

//
interface NoteFormProps {
  note: Note;
  setNote: React.Dispatch<React.SetStateAction<Note>>;
}

const FormNote = ({ note, setNote }: NoteFormProps) => {
  const [open, setOpen] = useState(false);

  const handleAddItem = () => {
    setNote((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        name: "",
        phone: "",
      },
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          name: "",
          category: "",
          material: "",
          color: "",
          size: "",
          service: "",
          notes: "",
          status: 0,
          images: [],
          price: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (note.items.length <= 1) return;

    setNote((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setNote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleCustomerChange = (field: string, value: string | number) => {
    setNote((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }));
  };

  const handleChange = (field: string, value: any) => {
    setNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //   // 1. Define your form.
  //   const form = useForm<z.infer<typeof formSchema>>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       name: "",
  //     },
  //   });

  //   // 2. Define a submit handler.
  //   function onSubmit(values: z.infer<typeof formSchema>) {
  //     // Do something with the form values.
  //     // ✅ This will be type-safe and validated.
  //     console.log(values);
  //   }

  return (
    <div className="mt-3">
      <Accordion
        type="multiple"
        defaultValue={["item-1", "item-2"]}
        className="flex flex-col gap-2"
      >
        {/* Customer */}
        <AccordionItem
          value="item-1"
          className="border border-border rounded-md "
        >
          <AccordionTrigger className="p-2 flex items-center ">
            <h2 className="font-medium">Customer</h2>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <Separator className="mb-2" />
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="font-normal">
                  Phone Number
                  <span className="text-red-700">*</span>{" "}
                </Label>
                {/* <p className="text-muted-foreground">
                  Enter the customer's mobile number first
                </p> */}
                <Input
                  id="phoneNumber"
                  // type="tel"
                  value={note.customer.phone}
                  onChange={(e) =>
                    handleCustomerChange("phone", e.target.value)
                  }
                  placeholder="Customer Phone Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName" className="font-normal">
                  Name
                  <span className="text-red-700">*</span>{" "}
                </Label>
                {/* <p className="text-muted-foreground">
                  The customer name is automatically filled in if the mobile
                  number has been previously registered.
                </p> */}
                <Input
                  id="customerName"
                  value={note.customer.name}
                  onChange={(e) => handleCustomerChange("name", e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Orders */}
        <AccordionItem
          value="item-2"
          className="border border-border rounded-md "
        >
          <AccordionTrigger className="p-2 flex items-center ">
            <h2 className="font-medium">Orders</h2>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <Separator className="mb-2" />

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="orderId" className="font-normal">
                  Order ID
                  {/* <span className="text-red-700">*</span>{" "} */}
                  {/* <p className="text-muted-foreground">
                  (Change if necessary)
                </p> */}
                </Label>
                <Input
                  id="itemName"
                  value={note.id}
                  onChange={(e) => handleChange("id", e.target.value)}
                  placeholder="WNC-0001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incomingOrder" className="font-normal">
                    Incoming Order
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !note.incomingOrder && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {note.incomingOrder ? (
                          format(note.incomingOrder, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={note.incomingOrder}
                        onSelect={(date) => {
                          handleChange("incomingOrder", date);
                          setOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCompletion" className="font-normal">
                    Estimated Completion
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !note.estimatedCompletion && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {note.estimatedCompletion ? (
                          format(note.estimatedCompletion, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={note.estimatedCompletion}
                        onSelect={(date) => {
                          handleChange("estimatedCompletion", date);
                          setOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {/* items */}
              <Separator />
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-medium">Items</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus />
                  Add Item
                </Button>
              </div>
              {note.items.map((item) => (
                <div
                  key={item.id}
                  className={`space-y-4 transition-all duration-300 ease-in-out transform ${
                    note.items.some((i) => i.id === item.id)
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4 -mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="itemName" className="font-normal">
                        Item Name
                        <span className="text-red-700">*</span>{" "}
                      </Label>
                      <Input
                        id="itemName"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(item.id, "name", e.target.value)
                        }
                        placeholder="Item name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="font-normal">
                        Category
                        <span className="text-red-700">*</span>{" "}
                      </Label>
                      <Select
                        value={item.category}
                        onValueChange={(value) =>
                          handleItemChange(item.id, "category", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Item category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="bag">Bag</SelectItem>
                          <SelectItem value="helmet">Helmet</SelectItem>
                          <SelectItem value="sandals">Saldals</SelectItem>
                          <SelectItem value="hat">Hat</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="materials" className="font-normal">
                        Materials
                      </Label>
                      <Input
                        id="materials"
                        value={item.material}
                        onChange={(e) =>
                          handleItemChange(item.id, "material", e.target.value)
                        }
                        placeholder="Item materials"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size" className="font-normal">
                        Size
                      </Label>
                      <Input
                        id="size"
                        value={item.size}
                        onChange={(e) =>
                          handleItemChange(item.id, "size", e.target.value)
                        }
                        placeholder="Item size"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colors" className="font-normal">
                        Colors
                      </Label>
                      <Input
                        id="colors"
                        value={item.color}
                        onChange={(e) =>
                          handleItemChange(item.id, "color", e.target.value)
                        }
                        placeholder="Item colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-normal">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={item.notes}
                      onChange={(e) =>
                        handleItemChange(item.id, "notes", e.target.value)
                      }
                      placeholder="Add notes from the customer or if necessary"
                      rows={1}
                    />
                  </div>
                  {/* Services */}
                  <div className="space-y-2">
                    <Label htmlFor="services" className="font-normal">
                      Services
                      <span className="text-red-700">*</span>{" "}
                    </Label>
                    <Select
                      value={item.service}
                      onValueChange={(value) =>
                        handleItemChange(item.id, "service", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Deep Clean">Deep Clean</SelectItem>
                        <SelectItem value="Regular Clean">
                          regular Clean
                        </SelectItem>
                        <SelectItem value="One Day Service">
                          One Day Service
                        </SelectItem>
                        <SelectItem value="Unyellowing Sole">
                          Unyellowing Sole
                        </SelectItem>
                        <SelectItem value="Reglue Lite">Reglue Lite</SelectItem>
                        <SelectItem value="Reglue Medium">
                          Reglue Medium
                        </SelectItem>
                        <SelectItem value="Repaint">Repaint</SelectItem>
                        <SelectItem value="Recolour">Recolour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mb-4"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={note.items.length <= 1}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Payment Details */}
        <AccordionItem
          value="item-3"
          className="border border-border rounded-md last:border-b"
        >
          <AccordionTrigger className="p-2 flex items-center ">
            <h2 className="font-medium">Payment Details</h2>
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <Separator className="mb-2" />
            <div className="mt-3">
              <h3 className="font-medium">Subtotal</h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between gap-3 text-start">
                  <h3 className="w-full">Service</h3>
                  <h3 className="w-2/5">Qty</h3>
                  <h3 className="w-full">Price</h3>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Input
                    disabled
                    // id="subtotal"
                    value="Deep Clean"
                  />
                  <Input
                    disabled
                    // id="subtotal"
                    type="number"
                    value={2}
                    className="w-2/5"
                  />
                  <Input
                    // disabled
                    // id="subtotal"
                    // type="number"
                    value="Rp 40.000"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Input
                    disabled
                    // id="subtotal"
                    value="Regular Clean"
                  />
                  <Input
                    disabled
                    // id="subtotal"
                    type="number"
                    value={1}
                    className="w-2/5"
                  />
                  <Input
                    // disabled
                    // id="subtotal"
                    // type="number"
                    value="Rp 35.000"
                  />
                </div>
              </div>

              {/* Discount */}
              <h3 className="font-medium mt-3">Discount</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount1">Ramadhan Sale</SelectItem>
                      <SelectItem value="discount2">Cuci 2 gratis 1</SelectItem>
                      {/* <SelectItem value="discount3"></SelectItem> */}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Plus />
                    Add Discount
                  </Button>
                </div>
                {/* add discount */}
                {/* <div className="text-center flex items-center justify-between gap-4">
                  <h3 className="w-full">Percent</h3>
                  <span className=" w-fit">/</span>
                  <h3 className="w-full">K</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input />
                  <Input />
                </div> */}
              </div>

              {/* Total */}
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <h3 className="font-medium">Total</h3>
                  <span className="font-medium">Rp 75.000</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <h3 className="font-medium">Payment Status</h3>
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
              </div>

              {/* Notes */}
              <div className="mt-3 space-y-2">
                <Label htmlFor="notes" className="font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes if necessary"
                  rows={1}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FormNote;
