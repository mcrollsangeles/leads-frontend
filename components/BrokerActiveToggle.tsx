"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleBrokerActive } from "@/lib/actions/brokers/brokers";

export default function BrokerActiveToggle({
    brokerId,
    isActive,
}: {
    brokerId: number;
    isActive: boolean;
}) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <button
            type="button"
            disabled={pending}
            onClick={() =>
                startTransition(async () => {
                    await toggleBrokerActive(brokerId, !isActive);
                    router.refresh();
                })
            }
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors disabled:opacity-60 ${isActive
                    ? "bg-green-100 text-green-700 ring-green-200 hover:bg-green-200"
                    : "bg-zinc-100 text-zinc-500 ring-zinc-200 hover:bg-zinc-200"
                }`}
        >
            {isActive ? "Active" : "Inactive"}
        </button>
    );
}
