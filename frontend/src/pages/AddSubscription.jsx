import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

function AddSubscription() {
  const [name, setName] = useState("");
  const [type, setType] = useState("domain");
  const [provider, setProvider] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [autoRenew, setAutoRenew] = useState(true);
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderDays, setReminderDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await API.post("/subscriptions", {
        name,
        type,
        provider,
        notificationEmail: notificationEmail || undefined,
        amount: amount ? Number(amount) : undefined,
        currency,
        billingCycle,
        autoRenew,
        expiryDate,
        reminderDays: Number(reminderDays),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save subscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Add subscription" subtitle="Create a new subscription to track.">
      <div className="card">
        <div className="card-header">
          <div className="text-base font-semibold text-slate-900">Details</div>
          <div className="mt-1 text-sm text-slate-600">
            Add an expiry date and when you want to be reminded.
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">
                  Subscription name
                </label>
                <input
                  id="name"
                  className="input"
                  placeholder="e.g. My domain, SSL certificate, Hosting plan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="provider">
                  Provider (optional)
                </label>
                <input
                  id="provider"
                  className="input"
                  placeholder="e.g. Namecheap, GoDaddy, AWS"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor="notificationEmail">
                  Notification email (optional)
                </label>
                <input
                  id="notificationEmail"
                  className="input"
                  type="email"
                  placeholder="Send emails to this address"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                />
                <div className="help">
                  If empty, we’ll use your Settings email (or your login email).
                </div>
              </div>

              <div>
                <label className="label" htmlFor="amount">
                  Amount (optional)
                </label>
                <div className="flex gap-2">
                  <select
                    className="select w-24 shrink-0"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                  <input
                    id="amount"
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 9.99"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="billingCycle">
                  Billing cycle
                </label>
                <select
                  id="billingCycle"
                  className="select"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                >
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="autoRenew"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                />
                <div>
                  <label className="label mb-0 inline-block" htmlFor="autoRenew">
                    Auto-renews
                  </label>
                  <div className="help">Uncheck if this subscription will not renew automatically.</div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  className="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="domain">Domain</option>
                  <option value="ssl">SSL</option>
                  <option value="hosting">Hosting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="expiryDate">
                  Expiry date
                </label>
                <input
                  id="expiryDate"
                  className="input"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="reminderDays">
                  Reminder window (days)
                </label>
                <input
                  id="reminderDays"
                  className="input"
                  type="number"
                  min="0"
                  placeholder="e.g. 7"
                  value={reminderDays}
                  onChange={(e) => setReminderDays(e.target.value)}
                  required
                />
                <div className="help">
                  We’ll treat subscriptions expiring within this window as “Expiring soon”.
                </div>
              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save subscription"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

export default AddSubscription;