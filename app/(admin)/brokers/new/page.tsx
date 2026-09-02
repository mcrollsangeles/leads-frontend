import BrokerForm from "@/components/BrokerForm";

export const metadata = { title: "New Broker" };

export default function NewBrokerPage() {
    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <h1 className="text-2xl font-semibold text-zinc-800">New broker</h1>
            <p className="mt-1 text-sm text-zinc-500">
                Configure the broker&apos;s schedule, timezone, and daily cap.
            </p>

            <div className="mt-6 max-w-2xl">
                <BrokerForm />
            </div>
        </div>
    );
}
