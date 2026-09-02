import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth_token";

export async function getAuthToken(): Promise<string | undefined> {
    return (await cookies()).get(AUTH_COOKIE)?.value;
}
