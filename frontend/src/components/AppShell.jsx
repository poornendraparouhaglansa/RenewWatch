import { NavLink, useLocation, useNavigate } from "react-router-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Topbar({ title, subtitle }) {
  return (
    <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur">
      <div className="container-app flex items-center justify-between py-4">
        <div>
          <div className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div>
          ) : null}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <a
            className="btn btn-secondary"
            href="https://tailwindcss.com"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind
          </a>
        </div>
      </div>
    </div>
  );
}

function SideNav() {
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/add", label: "Add subscription" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <nav className="card p-2">
      <div className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Menu
      </div>
      <div className="flex flex-col gap-1 p-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              cx(
                "rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              )
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function AppShell({
  title,
  subtitle,
  children,
  showLogout = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Topbar title={title} subtitle={subtitle} />

      <div className="container-app py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="space-y-4">
            <SideNav />
            {showLogout ? (
              <div className="card p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Account
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  You’re signed in.
                </div>
                <button className="btn btn-secondary mt-4 w-full" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : null}

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-slate-200 bg-slate-900 px-5 py-4 text-white shadow-sm">
                <div className="text-sm font-semibold">Renew Watch</div>
                <div className="mt-1 text-sm text-white/80">
                  Track renewals and never miss an expiry.
                </div>
                <div className="mt-3 text-xs text-white/70">
                  Current: {location.pathname}
                </div>
              </div>
            </div>
          </div>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

