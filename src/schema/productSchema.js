import { z } from "zod";

const addProductSchema = z.object({
  name: z.string().min(3, "Product Name must be at least 3 characters"),
  description: z
    .string()
    .max(100, "Product description should only be 100 characters")
    .optional(),
  price: z.union([
    z.string().transform((x) => x.replace(/[^0-9.-]+/g, "")),
    z.number(),
  ]),
  quantity: z.union([
    z.string().transform((x) => x.replace(/[^0-9.-]+/g, "")),
    z.number(),
  ]),
  sku: z.string().optional(),
}).passthrough();

export { addProductSchema } 
