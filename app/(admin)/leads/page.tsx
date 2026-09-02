import StatusBadge from "@/components/StatusBadge";
import AssignLeadForm from "@/components/AssignLeadForm";
import { getLeads } from "@/lib/actions/leads/leads";
import { getBrokers } from "@/lib/actions/brokers/brokers";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
    const [leads, brokers] = await Promise.all([getLeads(), getBrokers()]);

    const assignableBrokers = brokers
        .filter((broker) => broker.isActive)
        .map((broker) => ({
            id: broker.id,
            name: broker.name,
        }));

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <h1 className="text-2xl font-semibold text-zinc-800">Leads</h1>
            <p className="mt-1 text-sm text-zinc-500">
                Every submitted lead and its current status. Manually assign
                unsent leads here.
            </p>

            {leads.length === 0 ? (
                <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-200">
                    <p className="text-sm text-zinc-500">
                        No leads submitted yet.
                    </p>
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 text-sm">
                            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">IP address</th>
                                    <th className="px-4 py-3">Form</th>
                                    <th className="px-4 py-3">Broker</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {leads.map((lead) => (
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
                                            {lead.broker?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {new Date(lead.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {lead.status === "unsent" ? (
                                                <AssignLeadForm
                                                    leadId={lead.id}
                                                    brokers={assignableBrokers}
                                                />
                                            ) : (
                                                <span className="text-xs text-zinc-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
