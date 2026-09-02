import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { getAuthToken } from "@/lib/token";

// Server-side fetch helper for authenticated backend calls.
export async function apiFetch(
    path: string,
    init?: RequestInit
): Promise<Response> {
    const token = await getAuthToken();
    if (!token) redirect("/login");

    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(init?.headers ?? {}),
        },
        cache: "no-store",
    });
}
