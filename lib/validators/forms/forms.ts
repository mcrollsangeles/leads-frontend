import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Form name is required.")
        .max(100, "Form name is too long."),
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .regex(
            /^[a-z0-9]+(-[a-z0-9]+)*$/,
            "Slug must be lowercase letters, digits, and hyphens (e.g. lead-registration)."
        ),
});

export type FormInput = z.infer<typeof formSchema>;
