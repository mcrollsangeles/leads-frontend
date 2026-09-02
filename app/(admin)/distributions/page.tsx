import Link from "next/link";
import DistributionCreateForm from "@/components/DistributionCreateForm";
import { listDistributions } from "@/lib/actions/distributions/distributions";
import { getBrokers } from "@/lib/actions/brokers/brokers";
import { getForm } from "@/lib/actions/forms/forms";

export const metadata = { title: "Distributions" };

export default async function DistributionsPage() {
    const [distributions, brokers, form] = await Promise.all([
        listDistributions(),
        getBrokers(),
        getForm(),
    ]);

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <h1 className="text-2xl font-semibold text-zinc-800">
                Distribution
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
                Route incoming leads to brokers. Only one distribution can be
                created.
            </p>

            <div className="mt-6 max-w-2xl">
                {distributions.length > 0 ? (
                    <div className="space-y-4">
                        {distributions.map((distribution) => (
                            <div
                                key={distribution.id}
                                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800">
                                            {distribution.form.name}
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {distribution.brokers.length} brokers ·{" "}
                                            {distribution.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/distributions/${distribution.id}`}
                                        className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <p className="text-sm text-zinc-500">
                            A distribution already exists. Only one distribution
                            can be created.
                        </p>
                    </div>
                ) : !form ? (
                    <div className="rounded-xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-200">
                        <p className="text-sm font-semibold text-amber-800">
                            Oops, please create a form first.
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                            A distribution needs an existing form to attach to.
                        </p>
                        <Link
                            href="/forms"
                            className="mt-4 inline-block rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                        >
                            Create a form
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                            <p className="text-sm text-zinc-600">
                                This distribution will be attached to the form{" "}
                                <span className="font-semibold text-zinc-800">
                                    {form.name}
                                </span>{" "}
                                (/{form.slug}).
                            </p>
                        </div>
                        <DistributionCreateForm brokers={brokers} />
                    </div>
                )}
            </div>
        </div>
    );
}
