"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/server/http";
import { toFieldErrors } from "@/lib/actions/zod-errors";
import { brokerSchema } from "@/lib/validators/brokers/brokers";

export interface Broker {
    id: number;
    name: string;
    isActive: boolean;
    dailyCap: number;
    timezone: string;
    openingTime: string;
    closingTime: string;
    workingDays: string;
    createdAt: string;
    updatedAt: string;
}

export interface BrokerLead {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    ipAddress: string | null;
    status: string;
    createdAt: string;
    assignedAt: string | null;
    form: { id: number; name: string; slug: string } | null;
    distribution: { id: number; isActive: boolean } | null;
}

export interface BrokerDetail extends Broker {
    leads: BrokerLead[];
}

export async function getBrokers(): Promise<Broker[]> {
    const res = await apiFetch("/brokers");
    if (!res.ok) throw new Error("Failed to load brokers.");
    return res.json();
}

export async function getBroker(id: number): Promise<BrokerDetail> {
    const res = await apiFetch(`/brokers/${id}`);
    if (!res.ok) throw new Error("Failed to load broker.");
    return res.json();
}

export async function getBrokerLeads(id: number): Promise<BrokerLead[]> {
    const res = await apiFetch(`/brokers/${id}/leads`);
    if (!res.ok) throw new Error("Failed to load broker leads.");
    return res.json();
}

export interface BrokerFormState {
    fieldErrors?: Record<string, string[]>;
    error?: string;
}

function parseBrokerForm(formData: FormData) {
    return {
        name: String(formData.get("name") ?? ""),
        isActive: formData.get("isActive") === "on",
        dailyCap: formData.get("dailyCap") ?? "0",
        timezone: String(formData.get("timezone") ?? ""),
        openingTime: String(formData.get("openingTime") ?? ""),
        closingTime: String(formData.get("closingTime") ?? ""),
        workingDays: formData.getAll("workingDays").join(","),
    };
}

export async function createBrokerAction(
    _prev: BrokerFormState,
    formData: FormData
): Promise<BrokerFormState> {
    const raw = parseBrokerForm(formData);
    const parsed = brokerSchema.safeParse(raw);
    if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error) };

    const res = await apiFetch("/brokers", {
        method: "POST",
        body: JSON.stringify({ ...parsed.data, isActive: raw.isActive }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || "Failed to create broker." };

    revalidatePath("/brokers");
    redirect("/brokers");
}

export async function updateBrokerAction(
    _prev: BrokerFormState,
    formData: FormData
): Promise<BrokerFormState> {
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return { error: "Invalid broker id." };

    const raw = parseBrokerForm(formData);
    const parsed = brokerSchema.safeParse(raw);
    if (!parsed.success) return { fieldErrors: toFieldErrors(parsed.error) };

    const res = await apiFetch(`/brokers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...parsed.data, isActive: raw.isActive }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || "Failed to update broker." };

    revalidatePath("/brokers");
    revalidatePath(`/brokers/${id}`);
    redirect("/brokers");
}

export async function toggleBrokerActive(
    brokerId: number,
    isActive: boolean
): Promise<{ error?: string }> {
    const res = await apiFetch(`/brokers/${brokerId}`, {
        method: "PUT",
        body: JSON.stringify({ isActive }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.error || "Failed to update broker." };

    revalidatePath("/brokers");
    revalidatePath(`/brokers/${brokerId}`);
    return {};
}
