import { format } from "date-fns";
import type { ReceiptData } from "@/types/receipt";

interface ReceiptPreviewProps {
  receiptData: ReceiptData;
}

export function ReceiptPreview({ receiptData }: ReceiptPreviewProps) {
  const calculateSubtotal = () => {
    return receiptData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border print:shadow-none">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">RECEIPT</h1>
        <p className="text-gray-500">Your Company Name</p>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold">
            Receipt #: {receiptData.receiptNumber || "---"}
          </p>
          <p>
            Date:{" "}
            {receiptData.date ? format(receiptData.date, "dd/MM/yyyy") : "---"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Customer:</p>
          <p>{receiptData.customerName || "---"}</p>
          <p className="text-sm text-gray-600">
            {receiptData.customerAddress || "---"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.name || "---"}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-2 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-6">
        <div className="w-1/2">
          <div className="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax (10%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t border-gray-300">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold">Payment Method:</p>
        <p className="capitalize">
          {receiptData.paymentMethod.replace("_", " ") || "---"}
        </p>
      </div>

      {receiptData.notes && (
        <div className="mb-6">
          <p className="font-semibold">Notes:</p>
          <p className="text-gray-700">{receiptData.notes}</p>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Thank you for your business!</p>
        <p>Your Company Name - Address - Contact Information</p>
      </div>
    </div>
  );
}
