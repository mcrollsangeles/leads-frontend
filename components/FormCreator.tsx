"use client";

import { useActionState } from "react";
import {
    createFormAction,
    type FormFormState,
} from "@/lib/actions/forms/forms";

const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default function FormCreator() {
    const [state, formAction, pending] = useActionState<FormFormState, FormData>(
        createFormAction,
        {}
    );

    return (
        <form
            action={formAction}
            className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
        >
            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Form name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Lead Registration"
                    required
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
                    htmlFor="slug"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Public URL slug
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">/</span>
                    <input
                        id="slug"
                        name="slug"
                        type="text"
                        placeholder="lead-registration"
                        required
                        className={inputClass}
                    />
                </div>
                {state?.fieldErrors?.slug?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.slug[0]}
                    </p>
                )}
            </div>

            {state?.error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Creating..." : "Create form"}
            </button>
        </form>
    );
}
