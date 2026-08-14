"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Sign-in failed.");
      setLoading(false);
      return;
    }
    window.location.reload();
  }

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-md">
        <Link href="/" className="text-link mb-6"><ArrowLeft size={15} /> Back to portfolio</Link>
        <div className="surface-card p-7 md:p-9">
          <span className="skill-icon"><LockKeyhole size={22} /></span>
          <p className="eyebrow mt-6">Private administration</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Content & analytics</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">Sign in to publish blogs and insights or review site traffic.</p>

          {!configured ? (
            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200/80">
              Admin access is disabled until <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> are configured in the deployment environment.
            </div>
          ) : (
            <form className="mt-7" onSubmit={submit}>
              <label className="form-label">Admin password
                <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required autoFocus />
              </label>
              {error && <p className="mt-3 text-sm text-rose-400" role="alert">{error}</p>}
              <button className="button button-primary mt-5 w-full" type="submit" disabled={loading}>
                {loading ? <LoaderCircle className="animate-spin" size={16} /> : <LockKeyhole size={16} />}
                {loading ? "Signing in" : "Sign in"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
