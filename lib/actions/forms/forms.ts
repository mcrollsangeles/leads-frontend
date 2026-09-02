"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/server/http";
import { toFieldErrors } from "@/lib/actions/zod-errors";
import { formSchema } from "@/lib/validators/forms/forms";

export interface FormRecord {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    distribution: {
        id: number;
        isActive: boolean;
        formId: number;
        createdAt: string;
    } | null;
}

/** Returns the single form, or null when it has not been created yet. */
export async function getForm(): Promise<FormRecord | null> {
    const res = await apiFetch("/forms");
    if (!res.ok) throw new Error("Failed to load form.");
    return res.json();
}

export interface FormFormState {
    fieldErrors?: Record<string, string[]>;
    error?: string;
}

export async function createFormAction(
    _prev: FormFormState,
    formData: FormData
): Promise<FormFormState> {
    const raw = {
        name: String(formData.get("name") ?? ""),
        slug: String(formData.get("slug") ?? ""),
    };
    const parsed = formSchema.safeParse(raw);
    if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error) };

    const res = await apiFetch("/forms", {
        method: "POST",
        body: JSON.stringify(parsed.data),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || "Failed to create form." };

    revalidatePath("/forms");
    redirect("/forms");
}
