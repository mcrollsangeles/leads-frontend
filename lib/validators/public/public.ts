import { z } from "zod";

export const publicLeadSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(120, "Name is too long."),
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .pipe(z.email("Enter a valid email address.")),
    phone: z
        .string()
        .trim()
        .max(40, "Phone number is too long.")
        .regex(/^[0-9+\-()\s]*$/, "Phone can only contain numbers and + - ( ).")
        .optional(),
});

export type PublicLeadInput = z.infer<typeof publicLeadSchema>;
