export default function StatCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gold-700">{value}</p>
        </div>
    );
}
