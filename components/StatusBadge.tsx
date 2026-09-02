const STYLES: Record<string, string> = {
    sent: "bg-green-100 text-green-700 ring-green-200",
    unsent: "bg-amber-100 text-amber-700 ring-amber-200",
    duplicate: "bg-sky-100 text-sky-700 ring-sky-200",
    failed: "bg-red-100 text-red-700 ring-red-200",
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${STYLES[status] ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"
                }`}
        >
            {status}
        </span>
    );
}
