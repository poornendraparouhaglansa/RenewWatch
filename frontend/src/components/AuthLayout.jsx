import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="container-app flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-base font-semibold tracking-tight"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
                R
              </span>
              <span>Renew Watch</span>
            </Link>
            <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
            ) : null}
          </div>

          <div className="card">
            <div className="card-body">{children}</div>
          </div>

          {footer ? <div className="mt-6 text-center">{footer}</div> : null}

          <div className="mt-8 text-center text-xs text-slate-500">
            Built with React + Tailwind
          </div>
        </div>
      </div>
    </div>
  );
}

