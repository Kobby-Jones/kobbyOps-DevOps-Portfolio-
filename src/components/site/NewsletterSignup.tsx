"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

export default function NewsletterSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Could not subscribe. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 text-sm text-emerald-400 ${className}`}>
        <CheckCircle2 size={18} />
        You&apos;re subscribed. Thank you!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
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

      <div className="flex gap-2">
        
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
          className="form-input !mt-0 min-w-0 flex-1"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="button button-primary shrink-0"
        >
          {status === "sending" ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
          <span className="hidden sm:inline">Subscribe</span>
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </form>
  );
}
