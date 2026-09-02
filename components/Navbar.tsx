"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/brokers", label: "Brokers" },
    { href: "/forms", label: "Forms" },
    { href: "/distributions", label: "Distributions" },
    { href: "/leads", label: "Leads" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
            <div className="flex items-center gap-6">
                <Link
                    href="/dashboard"
                    className="text-xl font-bold tracking-wide text-gold-700 hover:text-gold"
                >
                    Leads Distribution
                </Link>
                <nav className="hidden gap-1 md:flex">
                    {LINKS.map((link) => {
                        const active =
                            pathname === link.href ||
                            pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active
                                        ? "bg-gold/10 text-gold-700"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <LogoutButton />
        </header>
    );
}
