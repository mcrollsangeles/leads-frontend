"use client";

import { useEffect, useRef, useActionState } from "react";
import {
    submitPublicLead,
    type PublicLeadState,
} from "@/lib/actions/public/public";

const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default function PublicLeadForm({ slug }: { slug: string }) {
    const [state, formAction, pending] = useActionState<
        PublicLeadState,
        FormData
    >(submitPublicLead, {});

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.message) formRef.current?.reset();
    }, [state?.message]);

    return (
        <form
            ref={formRef}
            action={formAction}
            className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
        >
            <input type="hidden" name="slug" value={slug} />

            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className={inputClass}
                />
                {state?.fieldErrors?.name?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.name[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                />
                {state?.fieldErrors?.email?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.email[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+1 555 0000"
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(
                            /[^0-9+\-()\s]/g,
                            ""
                        );
                    }}
                    className={inputClass}
                />
                {state?.fieldErrors?.phone?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.phone[0]}
                    </p>
                )}
            </div>

            {state?.error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}

            {state?.message && (
                <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md bg-gold py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}
