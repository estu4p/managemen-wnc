import { z } from "zod";

export const serviceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Service name is required!" }),
  price: z.number().min(1, { message: "Price is required!" }),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
