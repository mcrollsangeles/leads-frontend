import { notFound } from "next/navigation";
import PublicLeadForm from "@/components/PublicLeadForm";
import { API_BASE_URL } from "@/lib/api";

export default async function PublicFormPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const res = await fetch(
        `${API_BASE_URL}/public/forms/${encodeURIComponent(slug)}`,
        { cache: "no-store" }
    );

    if (!res.ok) notFound();

    const form = (await res.json()) as { id: number; name: string; slug: string };

    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-4 py-16">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-semibold text-zinc-800">
                    {form.name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    Please fill in your details below.
                </p>

                <div className="mt-6">
                    <PublicLeadForm slug={slug} />
                </div>
            </div>
        </div>
    );
}
