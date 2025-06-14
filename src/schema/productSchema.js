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
  quantity: z.coerce.number().gte(1, { message: "Quantity must be greater than or equal to 1" }),
  sku: z.string().optional(),
  categories: z.array(z.string()),
}).passthrough();

const addToCartSchema = z.object({
    quantity: z.coerce.number().gte(1, { message: "Invalid Quantity" }),
});
export { addProductSchema, addToCartSchema } 
