"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth/auth";

export default function LogoutButton() {
    const [pending, startTransition] = useTransition();
    const pathname = usePathname();

    // Do not render the logout button on the login page.
    if (pathname === "/login") return null;

    return (
        <button
            type="button"
            onClick={() => startTransition(() => logoutAction())}
            disabled={pending}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-gold hover:cursor-pointer hover:text-gold-700 disabled:opacity-60"
        >
            {pending ? "Logging out..." : "Log out"}
        </button>
    );
}
