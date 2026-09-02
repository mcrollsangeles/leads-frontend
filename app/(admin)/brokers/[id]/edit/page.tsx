import { notFound } from "next/navigation";
import BrokerForm from "@/components/BrokerForm";
import { getBroker } from "@/lib/actions/brokers/brokers";

export const metadata = { title: "Edit Broker" };

export default async function EditBrokerPage({
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
            <h1 className="text-2xl font-semibold text-zinc-800">
                Edit {broker.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
                Update schedule, timezone, or daily cap.
            </p>

            <div className="mt-6 max-w-2xl">
                <BrokerForm initial={broker} />
            </div>
        </div>
    );
}
