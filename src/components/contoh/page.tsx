"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ReceiptForm } from "@/components/receipt-form";
import { ReceiptPreview } from "@/components/receipt-preview";
import type { ReceiptData } from "@/types/receipt";

export default function ReceiptPage() {
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    receiptNumber: "",
    date: new Date(),
    customerName: "",
    customerAddress: "",
    items: [{ id: "1", name: "", quantity: 1, price: 0 }],
    notes: "",
    paymentMethod: "cash",
  });

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Receipt Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Receipt Details</h2>
          <ReceiptForm
            receiptData={receiptData}
            setReceiptData={setReceiptData}
          />
        </Card>

        <Card className="p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Receipt Preview</h2>
          <ReceiptPreview receiptData={receiptData} />
        </Card>
      </div>
    </main>
  );
}
