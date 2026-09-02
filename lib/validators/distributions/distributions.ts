import { z } from "zod";

export const distributionBrokerSelectionSchema = z.object({
    brokerId: z.coerce
        .number({ message: "Broker id must be a number." })
        .int("Broker id must be a whole number.")
        .positive("Broker id must be positive."),
    percentage: z.coerce
        .number({ message: "Percentage must be a number." })
        .min(0, "Percentage cannot be negative.")
        .max(100, "Percentage cannot exceed 100."),
});

export type DistributionBrokerSelection = z.infer<
    typeof distributionBrokerSelectionSchema
>;
