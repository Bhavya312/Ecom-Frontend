import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(3, "Profile Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
}).passthrough();

export { profileSchema } 
