import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
            <Link
                href="/"
                className="text-xl font-bold tracking-wide text-gold-700 hover:text-gold"
            >
                Leads Distribution
            </Link>
            <LogoutButton />
        </header>
    );
}
