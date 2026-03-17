import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AppShell from "../components/AppShell";

function initials(nameOrEmail) {
  const s = (nameOrEmail || "").trim();
  if (!s) return "RW";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "RW";
}

export default function Profile() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setIsLoading(true);
        const res = await API.get("/users/me");
        setMe(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const avatar = useMemo(() => {
    if (me?.avatarUrl) return { type: "url", value: me.avatarUrl };
    return { type: "initials", value: initials(me?.name || me?.email) };
  }, [me]);

  return (
    <AppShell title="Profile" subtitle="Your account and company details.">
      <div className="card">
        <div className="card-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">Profile</div>
            <div className="mt-1 text-sm text-slate-600">
              View your details and manage your account.
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/profile/edit")}>
            Edit profile
          </button>
        </div>

        <div className="card-body">
          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-600">Loading...</div>
          ) : me ? (
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
              <div className="flex flex-col items-start gap-3">
                <div className="relative">
                  {avatar.type === "url" ? (
                    <img
                      src={avatar.value}
                      alt="Profile"
                      className="h-28 w-28 rounded-3xl border border-slate-200 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-slate-900 text-3xl font-semibold text-white shadow-sm">
                      {avatar.value}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {me.name || "—"}
                  </div>
                  <div className="text-sm text-slate-600">{me.email}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Email delivery</div>
                  <div className="mt-1">
                    Notifications:{" "}
                    <span className="font-semibold">
                      {me.notificationEmail || me.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {me.companyName || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Job title
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {me.jobTitle || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {me.phone || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {me.location || "—"}
                  </div>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Password
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    For security, your password is not shown. Use “Edit profile” to
                    change it.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-slate-600">
              No profile data found.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

