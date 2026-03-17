import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AppShell from "../components/AppShell";

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
        const me = res.data;
        setName(me?.name || "");
        setNotificationEmail(me?.notificationEmail || me?.email || "");
        setCompanyName(me?.companyName || "");
        setJobTitle(me?.jobTitle || "");
        setPhone(me?.phone || "");
        setLocation(me?.location || "");
        setAvatarUrl(me?.avatarUrl || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
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
      await API.put("/users/me", {
        name,
        notificationEmail,
        companyName,
        jobTitle,
        phone,
        location,
        avatarUrl,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell title="Edit profile" subtitle="Update your personal and company details.">
      <div className="card">
        <div className="card-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">Edit profile</div>
            <div className="mt-1 text-sm text-slate-600">
              Keep your details up to date.
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/profile")}>
            Back to profile
          </button>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-600">Loading...</div>
          ) : (
            <form onSubmit={save} className="space-y-6">
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="notificationEmail">
                    Notification email
                  </label>
                  <input
                    id="notificationEmail"
                    className="input"
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    required
                  />
                  <div className="help">
                    Default destination for reminders (unless overridden per subscription).
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="companyName">
                    Company
                  </label>
                  <input
                    id="companyName"
                    className="input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Inc."
                  />
                </div>

                <div>
                  <label className="label" htmlFor="jobTitle">
                    Job title
                  </label>
                  <input
                    id="jobTitle"
                    className="input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Admin, IT Manager"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    className="input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="avatarUrl">
                    Profile image URL
                  </label>
                  <input
                    id="avatarUrl"
                    className="input"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <div className="help">
                    Use a public image URL for now (upload support can be added later).
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="text-sm font-semibold text-slate-900">Change password</div>
                <div className="mt-1 text-sm text-slate-600">
                  Leave blank if you don’t want to change it.
                </div>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="currentPassword">
                      Current password
                    </label>
                    <input
                      id="currentPassword"
                      className="input"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder={newPassword ? "Required" : "Optional"}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="newPassword">
                      New password
                    </label>
                    <input
                      id="newPassword"
                      className="input"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/profile")}
                  disabled={isSaving}
                >
                  Cancel
                </button>
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

