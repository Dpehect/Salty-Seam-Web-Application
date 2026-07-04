import { z } from "zod";

export const materialLabSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  projectType: z.enum(
    ["residential", "hospitality", "retail", "installation", "other"],
    { error: () => ({ message: "Please select a project type." }) },
  ),
  materialDirection: z.string().optional(),
  message: z
    .string()
    .min(20, "Please tell us a little more — at least 20 characters."),
  selectedProduct: z.string().optional(),
});

export type MaterialLabFormValues = z.infer<typeof materialLabSchema>;
