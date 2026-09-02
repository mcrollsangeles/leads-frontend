"use client";

import { useActionState } from "react";
import {
    createBrokerAction,
    updateBrokerAction,
    type Broker,
    type BrokerFormState,
} from "@/lib/actions/brokers/brokers";

const DAYS = [
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
    { value: 7, label: "Sun" },
];

const TIMEZONES = [
    "UTC",
    "Asia/Manila",
    "Asia/Singapore",
    "Asia/Hong_Kong",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Australia/Sydney",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
];

const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default function BrokerForm({ initial }: { initial?: Broker }) {
    const action = initial ? updateBrokerAction : createBrokerAction;
    const [state, formAction, pending] = useActionState<
        BrokerFormState,
        FormData
    >(action, {});

    const selectedDays = new Set(
        (initial?.workingDays ?? "1,2,3,4,5").split(",").map(Number)
    );

    return (
        <form
            action={formAction}
            className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
        >
            {initial && <input type="hidden" name="id" value={initial.id} />}

            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    Broker name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={initial?.name ?? ""}
                    placeholder="e.g. Broker A"
                    required
                    className={inputClass}
                />
                {state?.fieldErrors?.name?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.name[0]}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="timezone"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        Timezone
                    </label>
                    <input
                        id="timezone"
                        name="timezone"
                        type="text"
                        list="tz-list"
                        defaultValue={initial?.timezone ?? "UTC"}
                        required
                        className={inputClass}
                    />
                    <datalist id="tz-list">
                        {TIMEZONES.map((tz) => (
                            <option key={tz} value={tz} />
                        ))}
                    </datalist>
                    {state?.fieldErrors?.timezone?.[0] && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {state.fieldErrors.timezone[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="dailyCap"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        Daily cap (0 = unlimited)
                    </label>
                    <input
                        id="dailyCap"
                        name="dailyCap"
                        type="number"
                        min={0}
                        defaultValue={initial?.dailyCap ?? 0}
                        className={inputClass}
                    />
                    {state?.fieldErrors?.dailyCap?.[0] && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {state.fieldErrors.dailyCap[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="openingTime"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        Opening time
                    </label>
                    <input
                        id="openingTime"
                        name="openingTime"
                        type="time"
                        defaultValue={initial?.openingTime ?? "09:00"}
                        required
                        className={inputClass}
                    />
                    {state?.fieldErrors?.openingTime?.[0] && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {state.fieldErrors.openingTime[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="closingTime"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        Closing time
                    </label>
                    <input
                        id="closingTime"
                        name="closingTime"
                        type="time"
                        defaultValue={initial?.closingTime ?? "18:00"}
                        required
                        className={inputClass}
                    />
                    {state?.fieldErrors?.closingTime?.[0] && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {state.fieldErrors.closingTime[0]}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Working days
                </span>
                <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                        <label
                            key={day.value}
                            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:border-gold"
                        >
                            <input
                                type="checkbox"
                                name="workingDays"
                                value={day.value}
                                defaultChecked={selectedDays.has(day.value)}
                                className="accent-gold"
                            />
                            {day.label}
                        </label>
                    ))}
                </div>
                {state?.fieldErrors?.workingDays?.[0] && (
                    <p className="mt-1.5 text-sm text-red-600">
                        {state.fieldErrors.workingDays[0]}
                    </p>
                )}
            </div>

            <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={initial?.isActive ?? true}
                    className="accent-gold"
                />
                Active (can receive leads)
            </label>

            {state?.error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending
                        ? "Saving..."
                        : initial
                            ? "Save changes"
                            : "Create broker"}
                </button>
                <a
                    href="/brokers"
                    className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}
