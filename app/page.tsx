import StatCard from "@/components/StatCard";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/actions/dashboard/dashboard";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  let stats: DashboardStats;
  try {
    stats = await getDashboardStats();
  } catch (err) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-4">
        <p className="text-sm text-red-600">
          {err instanceof Error
            ? err.message
            : "Failed to load dashboard data."}
        </p>
      </div>
    );
  }

  const leadCards = [
    { label: "Total Leads", value: stats.leads.total },
    { label: "Sent", value: stats.leads.sent },
    { label: "Unsent", value: stats.leads.unsent },
    { label: "Duplicate", value: stats.leads.duplicate },
    { label: "Failed", value: stats.leads.failed },
  ];

  return (
    <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
      <h1 className="text-2xl font-semibold text-zinc-800">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Overview of leads, brokers, and distributions.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leadCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
          />
        ))}
        <StatCard
          label="Active Brokers"
          value={stats.brokers.filter((b) => b.isActive).length}
        />
        <StatCard
          label="Distributions"
          value={stats.distributions.length}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-sm font-semibold text-zinc-700">Brokers</h2>
          {stats.brokers.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No brokers yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100">
              {stats.brokers.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${b.isActive
                        ? "bg-green-500"
                        : "bg-zinc-300"
                        }`}
                    />
                    {b.name}
                  </span>
                  <span className="text-zinc-500">
                    {b.leadCount} leads
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-sm font-semibold text-zinc-700">
            Distributions
          </h2>
          {stats.distributions.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              No distributions yet.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100">
              {stats.distributions.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${d.isActive
                        ? "bg-green-500"
                        : "bg-zinc-300"
                        }`}
                    />
                    {d.form?.name ?? "Distribution"}
                  </span>
                  <span className="text-zinc-500">
                    {d.leadCount} leads · {d.brokerCount} brokers
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
