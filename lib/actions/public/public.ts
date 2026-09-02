"use server";

import { headers } from "next/headers";
import { API_BASE_URL } from "@/lib/api";
import { toFieldErrors } from "@/lib/actions/zod-errors";
import { publicLeadSchema } from "@/lib/validators/public/public";

export interface PublicLeadState {
    fieldErrors?: Record<string, string[]>;
    error?: string;
    message?: string;
    status?: string;
}

export async function submitPublicLead(
    _prev: PublicLeadState,
    formData: FormData
): Promise<PublicLeadState> {
    const raw = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
    };

    const parsed = publicLeadSchema.safeParse(raw);
    if (!parsed.success) {
        return { fieldErrors: toFieldErrors(parsed.error) };
    }

    const slug = String(formData.get("slug") ?? "");
    if (!slug) return { error: "Invalid form." };

    // Capture the visitor's IP from the request headers (set by the reverse
    // proxy). Same source the old route handler read from.
    const reqHeaders = await headers();
    const clientIp = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

    const fetchHeaders: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (clientIp) fetchHeaders["x-forwarded-for"] = clientIp;

    let res: Response;
    try {
        res = await fetch(
            `${API_BASE_URL}/public/forms/${encodeURIComponent(slug)}/submit`,
            {
                method: "POST",
                headers: fetchHeaders,
                body: JSON.stringify(parsed.data),
            }
        );
    } catch {
        return { error: "Unable to reach the server. Please try again later." };
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { error: data.error || "Something went wrong." };
    }

    return { status: data.status, message: data.message };
}
