import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import DistributionEditForm from "@/components/DistributionEditForm";
import { getDistribution } from "@/lib/actions/distributions/distributions";

export const metadata = { title: "Distribution" };

export default async function DistributionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const distributionId = Number(id);
    if (!Number.isInteger(distributionId) || distributionId <= 0) notFound();

    let distribution;
    try {
        distribution = await getDistribution(distributionId);
    } catch {
        notFound();
    }

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <h1 className="text-2xl font-semibold text-zinc-800">
                {distribution.form.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
                Distribution detail - set broker shares and review all leads
                that passed through.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section>
                    <h2 className="mb-3 text-sm font-semibold text-zinc-700">
                        Brokers &amp; percentages
                    </h2>
                    <DistributionEditForm
                        distributionId={distribution.id}
                        brokers={distribution.brokers}
                    />
                </section>

                <section>
                    <h2 className="mb-3 text-sm font-semibold text-zinc-700">
                        Lead history ({distribution.leads.length})
                    </h2>
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                        {distribution.leads.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-zinc-500">
                                No leads yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                                    <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Lead</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Broker</th>
                                            <th className="px-4 py-3">Received</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {distribution.leads.map((lead) => (
                                            <tr
                                                key={lead.id}
                                                className="hover:bg-zinc-50"
                                            >
                                                <td className="px-4 py-3 font-medium text-zinc-800">
                                                    {lead.name}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-600">
                                                    {lead.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={lead.status} />
                                                </td>
                                                <td className="px-4 py-3 text-zinc-600">
                                                    {lead.broker?.name ?? "-"}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-600">
                                                    {new Date(
                                                        lead.createdAt
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
