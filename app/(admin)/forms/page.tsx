import Link from "next/link";
import FormCreator from "@/components/FormCreator";
import { getForm } from "@/lib/actions/forms/forms";

export const metadata = { title: "Forms" };

export default async function FormsPage() {
    let form;
    try {
        form = await getForm();
    } catch (err) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-4">
                <p className="text-sm text-red-600">
                    {err instanceof Error ? err.message : "Failed to load form."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
            <h1 className="text-2xl font-semibold text-zinc-800">Lead form</h1>
            <p className="mt-1 text-sm text-zinc-500">
                The public form visitors use to submit leads. Only one form can
                be created.
            </p>

            <div className="mt-6 max-w-2xl">
                {form ? (
                    <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Form name
                            </p>
                            <p className="mt-1 text-sm text-zinc-800">{form.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Public URL
                            </p>
                            <Link
                                href={`/${form.slug}`}
                                target="_blank"
                                className="mt-1 inline-block text-sm font-medium text-gold-700 hover:text-gold"
                            >
                                /{form.slug}
                            </Link>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Created
                            </p>
                            <p className="mt-1 text-sm text-zinc-800">
                                {new Date(form.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {form.distribution ? (
                            <Link
                                href={`/distributions/${form.distribution.id}`}
                                className="inline-block rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                            >
                                View distribution
                            </Link>
                        ) : (
                            <Link
                                href="/distributions"
                                className="inline-block rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                            >
                                Create distribution
                            </Link>
                        )}
                    </div>
                ) : (
                    <FormCreator />
                )}
            </div>
        </div>
    );
}
