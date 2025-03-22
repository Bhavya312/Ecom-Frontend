import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "User Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email({
    message: "Please provide valid email",
  }),
  password: z.string().min(9, {
    message:"Minimum 9 characters required"
  }),
});

export { registerSchema, loginSchema };