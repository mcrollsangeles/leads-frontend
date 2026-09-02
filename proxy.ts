import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "auth_token";

const ADMIN_PATH = /^\/(dashboard|brokers|forms|distributions|leads)(\/|$)/;

export function proxy(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/login") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    const isAdmin = pathname === "/" || ADMIN_PATH.test(pathname);
    if (isAdmin && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
