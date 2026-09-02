"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/server/http";

export interface DistributionBrokerRow {
    id: number;
    distributionId: number;
    brokerId: number;
    percentage: number;
    isActive: boolean;
    broker: {
        id: number;
        name: string;
        isActive: boolean;
        dailyCap: number;
        timezone: string;
        openingTime: string;
        closingTime: string;
        workingDays: string;
    };
}

export interface DistributionLead {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    ipAddress: string | null;
    status: string;
    createdAt: string;
    assignedAt: string | null;
    broker: { id: number; name: string } | null;
}

export interface Distribution {
    id: number;
    isActive: boolean;
    formId: number;
    createdAt: string;
    form: { id: number; name: string; slug: string };
    brokers: DistributionBrokerRow[];
}

export interface DistributionDetail extends Distribution {
    leads: DistributionLead[];
}

export async function listDistributions(): Promise<Distribution[]> {
    const res = await apiFetch("/distributions");
    if (!res.ok) throw new Error("Failed to load distributions.");
    return res.json();
}

export async function getDistribution(
    id: number
): Promise<DistributionDetail> {
    const res = await apiFetch(`/distributions/${id}`);
    if (!res.ok) throw new Error("Failed to load distribution.");
    return res.json();
}

export interface DistributionFormState {
    fieldErrors?: Record<string, string[]>;
    error?: string;
}

// Create form layout
export async function createDistributionAction(
    _prev: DistributionFormState,
    formData: FormData
): Promise<DistributionFormState> {
    const brokerIds = formData.getAll("brokerId").map(Number);
    const selections = brokerIds
        .map((brokerId) => ({
            brokerId,
            percentage: Number(formData.get(`percentage_${brokerId}`) ?? 0),
        }))
        .filter((s) => Number.isFinite(s.percentage) && s.percentage > 0);

    if (selections.length === 0) {
        return {
            error: "Select at least one broker and give it a percentage above 0.",
        };
    }

    const total = selections.reduce((sum, s) => sum + s.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
        return {
            error: `Broker percentages must sum to 100 (currently ${total}).`,
        };
    }

    const res = await apiFetch("/distributions", {
        method: "POST",
        body: JSON.stringify({ brokerSelections: selections }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { error: data.error || "Failed to create distribution." };
    }

    revalidatePath("/distributions");
    redirect("/distributions");
}

// Edit form layout
export async function updateDistributionBrokersAction(
    _prev: DistributionFormState,
    formData: FormData
): Promise<DistributionFormState> {
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
        return { error: "Invalid distribution id." };
    }

    const brokerIds = formData.getAll("brokerId").map(Number);
    const selections = brokerIds.map((brokerId) => ({
        brokerId,
        percentage: Number(formData.get(`percentage_${brokerId}`) ?? 0),
        isActive: formData.get(`active_${brokerId}`) === "on",
    }));

    const activeTotal = selections
        .filter((s) => s.isActive)
        .reduce((sum, s) => sum + s.percentage, 0);
    if (Math.abs(activeTotal - 100) > 0.01) {
        return {
            error: `Active broker percentages must sum to 100 (currently ${activeTotal}).`,
        };
    }

    const res = await apiFetch(`/distributions/${id}/brokers`, {
        method: "PUT",
        body: JSON.stringify({ brokerSelections: selections }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { error: data.error || "Failed to update distribution." };
    }

    revalidatePath(`/distributions/${id}`);
    redirect(`/distributions/${id}`);
}
