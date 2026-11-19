"use client";

import { useState } from "react";
import { Download, ExternalLink, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/client-analytics";

export default function FreeDownloadGate({
  resourceSlug,
  hasDownload,
  externalUrl,
}: {
  resourceSlug: string;
  hasDownload: boolean;
  externalUrl?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const downloadHref = `/api/download/free/${encodeURIComponent(resourceSlug)}`;
  const targetHref = hasDownload ? downloadHref : externalUrl || downloadHref;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      trackAnalyticsEvent("cta_click", {
        label: resourceSlug,
        metadata: { placement: "resource_detail", resourceSlug },
      });

      setStatus("success");

      // Trigger the download / open after a short delay so the user sees the success state
      setTimeout(() => {
        if (hasDownload) {
          window.location.assign(targetHref);
        } else {
          window.open(targetHref, "_blank", "noreferrer");
        }
      }, 600);
    } catch {
      setError("Could not process your request. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
          <CheckCircle2 size={16} /> You&apos;re all set!
        </div>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          Your download {hasDownload ? "is starting" : "will open"} momentarily. If nothing happens,{" "}
          <a
            href={targetHref}
            target={hasDownload ? undefined : "_blank"}
            rel={hasDownload ? undefined : "noreferrer"}
            className="text-teal-400 underline underline-offset-2"
          >
            click here
          </a>.
        </p>

        {hasDownload && externalUrl ? (
          <a
            className="button button-secondary mt-4 w-full justify-center"
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open external resource <ExternalLink size={16} />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form className="surface-card p-6" onSubmit={handleSubmit}>
      <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
        <Download size={16} className="text-teal-400" /> Available now
      </span>
      <p className="mt-3 text-sm leading-7 text-zinc-400">
        Enter your email to get instant access. We&apos;ll also send you occasional updates&nbsp;&mdash; unsubscribe anytime.
      </p>

      {/* Honeypot */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <label className="form-label mt-5">
        <span className="flex items-center gap-1.5">
          <Mail size={14} className="text-zinc-500" /> Email
        </span>
        <input
          className="form-input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
        />
      </label>

      {error ? <p className="mt-4 text-sm text-rose-400" role="alert">{error}</p> : null}

      <button
        className="button button-primary mt-6 w-full justify-center"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <LoaderCircle className="animate-spin" size={16} />
        ) : (
          <Download size={16} />
        )}
        {status === "sending"
          ? "Processing…"
          : hasDownload
            ? "Download free"
            : "Get access"}
      </button>
    </form>
  );
}
