import { z } from "zod";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export const brokerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Broker name is required.")
        .max(80, "Broker name is too long."),
    dailyCap: z.coerce
        .number({ message: "Daily cap must be a number." })
        .int("Daily cap must be a whole number.")
        .min(0, "Daily cap cannot be negative.")
        .default(0),
    timezone: z.string().trim().min(1, "Timezone is required."),
    openingTime: z
        .string()
        .trim()
        .regex(TIME, "Opening time must use 24h HH:mm format."),
    closingTime: z
        .string()
        .trim()
        .regex(TIME, "Closing time must use 24h HH:mm format."),
    workingDays: z
        .string()
        .regex(/^[1-7](,[1-7])*$/, "Select at least one working day."),
});

export type BrokerInput = z.infer<typeof brokerSchema>;
