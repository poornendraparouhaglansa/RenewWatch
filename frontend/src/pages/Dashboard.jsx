import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

function daysUntil(dateString) {
  const ms = new Date(dateString).getTime() - new Date().getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchSubscriptions = async () => {
    try {
      setError("");
      setIsLoading(true);
      const res = await API.get("/subscriptions");
      setSubscriptions(res.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load subscriptions.");
    } finally {
      setIsLoading(false);
    }

  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const deleteSubscription = async (id) => {
    const ok = window.confirm("Delete this subscription?");
    if (!ok) return;
    await API.delete(`/subscriptions/${id}`);
    fetchSubscriptions();
  };

  const total = subscriptions.length;
  const expiringSoon = subscriptions.filter((s) => {
    const d = daysUntil(s.expiryDate);
    return d >= 0 && d <= Number(s.reminderDays ?? 7);
  }).length;
  const expired = subscriptions.filter((s) => daysUntil(s.expiryDate) < 0).length;

  return (
    <AppShell
      title="Dashboard"
      subtitle="Track expiries, set reminders, and stay on top of renewals."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="card-body">
            <div className="text-sm font-medium text-slate-600">Total</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {total}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm font-medium text-slate-600">Expiring soon</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {expiringSoon}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Within each subscription’s reminder window
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm font-medium text-slate-600">Expired</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {expired}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">My subscriptions</div>
            <div className="mt-1 text-sm text-slate-600">
              Manage reminders and keep renewals organized.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={fetchSubscriptions} disabled={isLoading}>
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/add")}>
              Add subscription
            </button>
          </div>
        </div>

        <div className="card-body">
          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-600">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <div className="text-sm font-semibold text-slate-900">
                No subscriptions yet
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Add your first subscription to start tracking expiry dates.
              </div>
              <button className="btn btn-primary mt-4" onClick={() => navigate("/add")}>
                Add subscription
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="border-b border-slate-200/60 pb-3 pr-4">Name</th>
                    <th className="border-b border-slate-200/60 pb-3 pr-4">Provider</th>
                    <th className="border-b border-slate-200/60 pb-3 pr-4">Billing</th>
                    <th className="border-b border-slate-200/60 pb-3 pr-4">Expiry</th>
                    <th className="border-b border-slate-200/60 pb-3 pr-4">Reminder</th>
                    <th className="border-b border-slate-200/60 pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const left = daysUntil(sub.expiryDate);
                    const status =
                      left < 0 ? "Expired" : left === 0 ? "Today" : `${left} day${left === 1 ? "" : "s"} left`;
                    const statusTone =
                      left < 0
                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                        : left <= Number(sub.reminderDays ?? 7)
                          ? "bg-amber-50 text-amber-800 ring-amber-200"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-200";

                    return (
                      <tr key={sub._id} className="group">
                        <td className="border-b border-slate-100 py-4 pr-4 align-top">
                          <div className="font-semibold text-slate-900">{sub.name}</div>
                          <div className="mt-1 inline-flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${statusTone}`}
                            >
                              {status}
                            </span>
                          </div>
                        </td>
                        <td className="border-b border-slate-100 py-4 pr-4 align-top">
                          <div className="text-sm font-medium text-slate-900">
                            {sub.provider || "-"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{sub.type}</div>
                        </td>
                        <td className="border-b border-slate-100 py-4 pr-4 align-top">
                          <div className="text-sm font-medium text-slate-900">
                            {typeof sub.amount === "number" && !Number.isNaN(sub.amount)
                              ? `${sub.currency || "USD"} ${sub.amount.toFixed(2)}`
                              : "—"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 capitalize">
                            {sub.billingCycle || "yearly"}
                            {sub.autoRenew === false ? " · Not auto-renewing" : ""}
                          </div>
                        </td>
                        <td className="border-b border-slate-100 py-4 pr-4 align-top">
                          <div className="text-sm font-medium text-slate-900">
                            {formatDate(sub.expiryDate)}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {new Date(sub.expiryDate).toLocaleDateString(undefined, {
                              weekday: "long",
                            })}
                          </div>
                        </td>
                        <td className="border-b border-slate-100 py-4 pr-4 align-top">
                          <div className="text-sm font-medium text-slate-900">
                            {sub.reminderDays} days
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Notify within this window
                          </div>
                        </td>
                        <td className="border-b border-slate-100 py-4 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              className="btn btn-secondary"
                              onClick={() => navigate(`/edit/${sub._id}`)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteSubscription(sub._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;