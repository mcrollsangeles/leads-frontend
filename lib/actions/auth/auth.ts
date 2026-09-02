"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";
import { loginSchema } from "@/lib/validators/auth/auth";

const AUTH_COOKIE = "auth_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface LoginState {
    fieldErrors?: {
        email?: string[];
        password?: string[];
    };
    error?: string;
}

export async function loginAction(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        const tree = z.treeifyError(parsed.error);
        return {
            fieldErrors: {
                email: tree.properties?.email?.errors,
                password: tree.properties?.password?.errors,
            },
        };
    }

    let res: Response;
    try {
        res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    } catch {
        return { error: "Unable to reach the server. Please try again." };
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return { error: data.error || "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, data.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: TOKEN_MAX_AGE,
    });

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    redirect("/login");
}
