"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignLead } from "@/lib/actions/leads/leads";

export default function AssignLeadForm({
    leadId,
    brokers,
}: {
    leadId: number;
    brokers: { id: number; name: string }[];
}) {
    const [brokerId, setBrokerId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    function submit() {
        if (!brokerId) {
            setError("Select a broker.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const result = await assignLead(leadId, Number(brokerId));
            if (result.error) setError(result.error);
            else router.refresh();
        });
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <select
                value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-800 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
                <option value="">Assign to…</option>
                {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                        {broker.name}
                    </option>
                ))}
            </select>
            <button
                type="button"
                onClick={submit}
                disabled={pending || brokers.length === 0}
                className="rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Assigning…" : "Assign"}
            </button>
            {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
    );
}
