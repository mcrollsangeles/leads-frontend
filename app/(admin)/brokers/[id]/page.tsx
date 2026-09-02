import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { getBroker } from "@/lib/actions/brokers/brokers";

export const metadata = { title: "Broker" };

export default async function BrokerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const brokerId = Number(id);
    if (!Number.isInteger(brokerId) || brokerId <= 0) notFound();

    let broker;
    try {
        broker = await getBroker(brokerId);
    } catch {
        notFound();
    }

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-800">
                        {broker.name}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        {broker.timezone} · {broker.openingTime}–
                        {broker.closingTime} · daily cap{" "}
                        {broker.dailyCap === 0 ? "unlimited" : broker.dailyCap}
                    </p>
                </div>
                <Link
                    href={`/brokers/${broker.id}/edit`}
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-gold hover:text-gold-700"
                >
                    Edit broker
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                <div className="border-b border-zinc-200 px-4 py-3">
                    <h2 className="text-sm font-semibold text-zinc-700">
                        Leads received ({broker.leads.length})
                    </h2>
                </div>
                {broker.leads.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-zinc-500">
                        No leads assigned to this broker yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 text-sm">
                            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Lead name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">IP address</th>
                                    <th className="px-4 py-3">Form name</th>
                                    <th className="px-4 py-3">Date received</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {broker.leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-zinc-50">
                                        <td className="px-4 py-3 font-medium text-zinc-800">
                                            {lead.name}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {lead.email}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {lead.phone ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {lead.ipAddress ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {lead.form?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {new Date(lead.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
