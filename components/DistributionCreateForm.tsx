"use client";

import { useActionState, useState } from "react";
import {
    createDistributionAction,
    type DistributionFormState,
} from "@/lib/actions/distributions/distributions";
import type { Broker } from "@/lib/actions/brokers/brokers";

export default function DistributionCreateForm({
    brokers,
}: {
    brokers: Broker[];
}) {
    const [state, formAction, pending] = useActionState<
        DistributionFormState,
        FormData
    >(createDistributionAction, {});
    const [total, setTotal] = useState(0);

    function updateTotal(e: React.FormEvent<HTMLFormElement>) {
        const fd = new FormData(e.currentTarget);
        let sum = 0;
        for (const id of fd.getAll("brokerId")) {
            const value = Number(fd.get(`percentage_${id}`) ?? 0);
            if (Number.isFinite(value)) sum += value;
        }
        setTotal(Math.round(sum * 100) / 100);
    }

    return (
        <form
            action={formAction}
            onChange={updateTotal}
            className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
        >
            {brokers.length === 0 ? (
                <p className="text-sm text-zinc-500">
                    No brokers yet. Create at least one broker before setting up
                    a distribution.
                </p>
            ) : (
                <ul className="space-y-2">
                    {brokers.map((broker) => (
                        <li
                            key={broker.id}
                            className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2"
                        >
                            <input
                                type="checkbox"
                                name="brokerId"
                                value={broker.id}
                                className="accent-gold"
                            />
                            <span className="flex-1 text-sm text-zinc-700">
                                {broker.name}
                                {!broker.isActive && (
                                    <span className="ml-2 text-xs text-zinc-400">
                                        (inactive)
                                    </span>
                                )}
                            </span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    name={`percentage_${broker.id}`}
                                    min={0}
                                    max={100}
                                    step="any"
                                    placeholder="0"
                                    className="w-24 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                                />
                                <span className="text-sm text-zinc-400">%</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <p
                className={`text-sm font-semibold ${total === 100 ? "text-green-600" : "text-zinc-600"
                    }`}
            >
                Total: {total}% (must equal 100%)
            </p>

            {state?.error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={pending || brokers.length === 0}
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Creating..." : "Create distribution"}
            </button>
        </form>
    );
}
