import { z } from "zod";

export const editUserValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, { message: "Please fill in the email field" }),
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(1, { message: "First name is required" }),
  lastName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(1, { message: "Last name is required" }),
});

export type editUserValidatorType = z.infer<typeof editUserValidator>;
