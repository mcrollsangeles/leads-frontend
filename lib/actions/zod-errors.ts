import { z } from "zod";

interface Treeified {
    properties?: Record<string, { errors?: string[] } | undefined>;
}

/**
 * Converts a Zod error into the `{ [field]: string[] }` shape consumed by
 * `useActionState` (matches the login action).
 */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
    const tree = z.treeifyError(error) as unknown as Treeified;
    const out: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(tree.properties ?? {})) {
        if (value?.errors?.length) out[key] = value.errors;
    }
    return out;
}
