import { z } from "zod";

const addCategorySchema = z.object({
    name: z.string().min(3, "Category Name must be at least 3 characters"),
    description: z.string().max(100, "Category description should only be 100 characters").optional(),
});

export { addCategorySchema }