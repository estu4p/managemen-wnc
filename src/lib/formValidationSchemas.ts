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
