import Link from "next/link";
import BrokerActiveToggle from "@/components/BrokerActiveToggle";
import { getBrokers } from "@/lib/actions/brokers/brokers";

export const metadata = { title: "Brokers" };

const DAY_LABELS: Record<number, string> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
};

function formatDays(days: string): string {
    return days
        .split(",")
        .map((d) => DAY_LABELS[Number(d)] ?? d)
        .join(", ");
}

export default async function BrokersPage() {
    let brokers;
    try {
        brokers = await getBrokers();
    } catch (err) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-4">
                <p className="text-sm text-red-600">
                    {err instanceof Error
                        ? err.message
                        : "Failed to load brokers."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-800">Brokers</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Create and manage the brokers that receive leads.
                    </p>
                </div>
                <Link
                    href="/brokers/new"
                    className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                >
                    New broker
                </Link>
            </div>

            {brokers.length === 0 ? (
                <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-200">
                    <p className="text-sm text-zinc-500">
                        No brokers yet. Create your first broker to get started.
                    </p>
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                    <table className="min-w-full divide-y divide-zinc-200 text-sm">
                        <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Daily cap</th>
                                <th className="px-4 py-3">Timezone</th>
                                <th className="px-4 py-3">Hours</th>
                                <th className="px-4 py-3">Working days</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {brokers.map((broker) => (
                                <tr key={broker.id} className="hover:bg-zinc-50">
                                    <td className="px-4 py-3 font-medium text-zinc-800">
                                        {broker.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <BrokerActiveToggle
                                            brokerId={broker.id}
                                            isActive={broker.isActive}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">
                                        {broker.dailyCap === 0
                                            ? "Unlimited"
                                            : broker.dailyCap}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">
                                        {broker.timezone}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">
                                        {broker.openingTime}–{broker.closingTime}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">
                                        {formatDays(broker.workingDays)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/brokers/${broker.id}`}
                                                className="text-sm font-medium text-gold-700 hover:text-gold"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/brokers/${broker.id}/edit`}
                                                className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
