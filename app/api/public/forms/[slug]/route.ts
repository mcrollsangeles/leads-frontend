import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

// Proxies a public lead submission to the backend while forwarding the visitor's IP 
// so the backend stores the
// real client IP rather than the Next.js server address
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;
    const body = await request.json().catch(() => ({}));

    const clientIp = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (clientIp) headers["x-forwarded-for"] = clientIp;

    let upstream: Response;
    try {
        upstream = await fetch(
            `${API_BASE_URL}/public/forms/${encodeURIComponent(slug)}/submit`,
            {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            }
        );
    } catch {
        return NextResponse.json(
            { error: "Unable to reach the server. Please try again later." },
            { status: 502 }
        );
    }

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
}
