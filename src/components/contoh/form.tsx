"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReceiptData } from "@/types/receipt";

interface ReceiptFormProps {
  receiptData: ReceiptData;
  setReceiptData: React.Dispatch<React.SetStateAction<ReceiptData>>;
}

export function ReceiptForm({ receiptData, setReceiptData }: ReceiptFormProps) {
  const [open, setOpen] = useState(false);

  const handleAddItem = () => {
    setReceiptData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now().toString(), name: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (receiptData.items.length <= 1) return;

    setReceiptData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setReceiptData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleChange = (field: string, value: any) => {
    setReceiptData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="receiptNumber">Receipt Number</Label>
          <Input
            id="receiptNumber"
            value={receiptData.receiptNumber}
            onChange={(e) => handleChange("receiptNumber", e.target.value)}
            placeholder="INV-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !receiptData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {receiptData.date ? (
                  format(receiptData.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={receiptData.date}
                onSelect={(date) => {
                  handleChange("date", date);
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          value={receiptData.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerAddress">Customer Address</Label>
        <Textarea
          id="customerAddress"
          value={receiptData.customerAddress}
          onChange={(e) => handleChange("customerAddress", e.target.value)}
          placeholder="123 Main St, City"
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>

        {receiptData.items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <Input
                value={item.name}
                onChange={(e) =>
                  handleItemChange(item.id, "name", e.target.value)
                }
                placeholder="Item name"
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "quantity",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="Qty"
                min="1"
              />
            </div>
            <div className="col-span-4">
              <Input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "price",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                disabled={receiptData.items.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select
          value={receiptData.paymentMethod}
          onValueChange={(value) => handleChange("paymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={receiptData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => window.print()}>
          Print
        </Button>
        <Button>Save Receipt</Button>
      </div>
    </div>
  );
}
