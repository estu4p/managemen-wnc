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
  invoiceId: z.string().optional(),
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

export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 character!" }),
  phone: z
    .string()
    .min(9, { message: "Phone number must be at least 9 character!" }),
  photo: z.string().optional(),
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const invoiceSchema = z.object({
  id: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be 0 or greater!" }),
  addDiscount: z.coerce.number().optional(),
  note: z.string().optional(),
  progress: z.string().optional(),
  paymentStatus: z.enum(["PAID", "UNPAID"]).optional(),
  paymentMethod: z
    .enum(["CASH", "QRIS", "TRANSFER", "DEBIT", "OTHER"], {
      message: "Payment Method is required!",
    })
    .optional(),
  customer: z.object({
    id: z.string().optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters!" }),
    phone: z
      .string()
      .min(9, { message: "Phone number must be at least 9 characters!" }),
    photo: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        name: z.string().min(1, { message: "Item name is required!" }),
        itemCategory: z.enum([
          "SHOE",
          "BAG",
          "HELMET",
          "SANDAL",
          "HAT",
          "WALLET",
          "OTHER",
        ]),
        material: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        photos: z.array(z.string().url()).optional(),
        note: z.string().optional(),
        estimatedCompletion: z.coerce.date().optional(),
        progress: z
          .enum([
            "NEW_ORDER",
            "WAITTING",
            "ON_PROGRESS",
            "FINISHING",
            "DONE",
            "PICKED_UP",
            "CANCELED",
          ])
          .optional(),
        service: z
          .array(z.number())
          .min(1, { message: "Service is required!" }),
      })
    )
    .min(1, { message: "At least one item is required!" }),
  discounts: z.array(z.number()).optional(),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 character!" }),
  name: z.string().min(2, { message: "Name must be at least 2 character!" }),
  role: z.enum(["ADMIN", "SUPERADMIN"], {
    message: "Role is required!",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter!",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number!" })
    .optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

// update user (password optional)
export const userUpdateSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 character!" }),
  name: z.string().min(2, { message: "Name must be at least 2 character!" }),
  role: z.enum(["ADMIN", "SUPERADMIN"], {
    message: "Role is required!",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter!",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number!" })
    .optional()
    .or(z.literal("")),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

// buat validasi password
