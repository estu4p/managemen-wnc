import { z } from "zod";

export const serviceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Service name is required!" }),
  price: z.number().min(1, { message: "Price is required!" }),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

export const discountSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(2, { message: "Discount title must be at least 2 characters!" }),
  amount: z.number().min(1, { message: "Discount amount is required!" }),
  type: z.enum(["NOMINAL", "PERCENTAGE"]),
  fromDate: z.coerce.date({ message: "Start time is required!" }),
  untilDate: z.coerce.date({ message: "End time is required!" }),
});

export type DiscountSchema = z.infer<typeof discountSchema>;

export const revenueTargetSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(2, { message: "Revenue target title must be at least 2 charecter!" }),
  category: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "OTHER"]),
  fromDate: z.coerce.date({ message: "Start time is required!" }),
  untilDate: z.coerce.date({ message: "End time is required!" }),
  totalTarget: z.number().min(1, { message: "Total target is required!" }),
  status: z.enum(["SUCCESS", "FAILED", "PROCESS"]),
});

export type RevenueTargetSchema = z.infer<typeof revenueTargetSchema>;

export const inventorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(2, { message: "Inventory name must be at least 2 character!" }),
  category: z.enum(["EQUIPMENT", "MATERIAL", "PRODUCT", "OTHER"], {
    message: "Type is required!",
  }),
  unit: z.enum(
    ["PCS", "LITER", "GRAM", "METER", "PAIRS", "BOX", "ROLL", "OTHER"],
    { message: "Unit is required!" }
  ),
  initialStock: z.number().min(1, { message: "Initial Stock is required!" }),
  currentStock: z.number(),
  price: z.coerce.number().min(1, { message: "Price is required!" }),
  photo: z.string().optional(),
});

export type InventorySchema = z.infer<typeof inventorySchema>;

export const transactionSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  type: z.enum(["EXPENSE", "INCOME"], { message: "Type is required!" }),
  category: z.enum(
    [
      "SERVICE_INCOME",
      "PRODUCT_SALES",
      "OTHER_INCOME",
      "MATERIAL_PURCHASE",
      "EQUIPMENT_PURCHASE",
      "SALARY",
      "RENT",
      "UTILITY",
      "MARKETING",
      "OTHER_EXPENSE",
    ],
    { message: "Category is required!" }
  ),
  amount: z.coerce.number().min(1, { message: "Amount is required!" }),
  notes: z.string().optional(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
