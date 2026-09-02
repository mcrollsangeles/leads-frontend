"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/server/http";
import { assignLeadSchema } from "@/lib/validators/leads/leads";

export interface LeadRecord {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    ipAddress: string | null;
    status: "sent" | "unsent" | "duplicate" | "failed";
    formId: number | null;
    brokerId: number | null;
    distributionId: number | null;
    createdAt: string;
    assignedAt: string | null;
    broker: { id: number; name: string } | null;
    form: { id: number; name: string; slug: string } | null;
    distribution: { id: number; isActive: boolean } | null;
}

export async function getLeads(): Promise<LeadRecord[]> {
    const res = await apiFetch("/leads");
    if (!res.ok) throw new Error("Failed to load leads.");
    return res.json();
}

export async function assignLead(
    leadId: number,
    brokerId: number
): Promise<{ error?: string }> {
    if (!Number.isInteger(leadId) || leadId <= 0) {
        return { error: "Invalid lead id." };
    }

    const parsed = assignLeadSchema.safeParse({ brokerId });
    if (!parsed.success) {
        return { error: "Please select a broker." };
    }

    const res = await apiFetch(`/leads/${leadId}/assign`, {
        method: "POST",
        body: JSON.stringify({ brokerId: parsed.data.brokerId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || "Failed to assign lead." };

    revalidatePath("/leads");
    return {};
}
