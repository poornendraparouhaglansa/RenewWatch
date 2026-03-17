import { useEffect, useState } from "react";
import API from "../services/api";
import AppShell from "../components/AppShell";

function Settings() {
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setIsLoading(true);
        const res = await API.get("/users/me");
        setNotificationEmail(res.data?.notificationEmail || res.data?.email || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load settings.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const res = await API.put("/users/me", { notificationEmail });
      setNotificationEmail(res.data?.notificationEmail || notificationEmail);
      setMessage("Saved. Future emails will be sent to this address.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell title="Settings" subtitle="Control where Renew Watch sends emails.">
      <div className="card">
        <div className="card-header">
          <div className="text-base font-semibold text-slate-900">
            Notification email
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Reminder and subscription emails will be sent here.
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-600">Loading...</div>
          ) : (
            <form onSubmit={save} className="space-y-4">
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              {message ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              <div>
                <label className="label" htmlFor="notificationEmail">
                  Email address
                </label>
                <input
                  id="notificationEmail"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  required
                />
                <div className="help">
                  Tip: you can set this to a different inbox than your login email.
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default Settings;

