import { z } from "zod";

export const assignLeadSchema = z.object({
    brokerId: z.coerce
        .number({ message: "Select a broker." })
        .int("Select a broker.")
        .positive("Select a broker."),
});

export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
