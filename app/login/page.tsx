"use client";

import { useActionState } from "react"; // new hook  from react19 (personally just want to try)
import { loginAction, type LoginState } from "@/lib/actions/auth/auth";

export default function LoginPage() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(
        loginAction,
        {}
    );

    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-4 py-16">
            <div className="w-full max-w-sm">
                <h1 className="mb-8 text-center text-2xl font-semibold text-zinc-800">
                    Log in to your account
                </h1>

                <form
                    className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-zinc-200"
                    action={formAction}
                >
                    <div className="mb-5">
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
                            placeholder="Email"
                            autoComplete="email"
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                        />
                        {state?.fieldErrors?.email?.[0] && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {state.fieldErrors.email[0]}
                            </p>
                        )}
                    </div>

                    <div className="mb-7">
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                        />
                        {state?.fieldErrors?.password?.[0] && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {state.fieldErrors.password[0]}
                            </p>
                        )}
                    </div>

                    {state?.error && (
                        <p className="mb-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                            {state.error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full rounded-md bg-gold py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
