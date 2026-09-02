import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

const AUTH_COOKIE = "auth_token";

export interface DashboardStats {
    leads: {
        total: number;
        sent: number;
        unsent: number;
        duplicate: number;
        failed: number;
    };
    brokers: {
        id: number;
        name: string;
        isActive: boolean;
        dailyCap: number;
        timezone: string;
        leadCount: number;
    }[];
    distributions: {
        id: number;
        isActive: boolean;
        form: { id: number; name: string; slug: string } | null;
        brokerCount: number;
        leadCount: number;
    }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) redirect("/login");

    const res = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to load dashboard data.");
    }

    return res.json();
}
