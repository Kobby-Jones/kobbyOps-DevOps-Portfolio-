"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

const serviceOptions = [
  "Cloud & DevOps Engineering",
  "Backend Engineering",
  "Production Readiness Audit",
  "Architecture Consulting",
  "Technical Mentorship",
  "Other",
];

const budgetOptions = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $5,000",
  "$5,000+",
  "Not sure yet",
];

const timelineOptions = [
  "Less than 2 weeks",
  "2 – 4 weeks",
  "1 – 3 months",
  "Ongoing / retainer",
  "Flexible",
];

export default function ConsultationForm() {
const [form, setForm] = useState({
  name: "",
  email: "",
  organization: "",
  serviceRequested: "",
  projectDescription: "",
  budgetRange: "",
  timeline: "",
  websiteUrl: "",
  contactCode: "", // honeypot
});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.fallback) {
        window.location.href = result.fallback;
        return;
      }

      if (!response.ok) {
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setConfirmationSent(Boolean(result.confirmationSent));
      setStatus("success");
    } catch {
      setErrorMessage("Could not submit. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-card flex flex-col items-center p-10 text-center">
        <CheckCircle2 size={40} className="text-emerald-400" />
        <h3 className="mt-5 text-xl font-semibold text-white">
          Request received
        </h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
          Thank you for reaching out. I review every request personally and will
          respond within 1–2 business days.
          {confirmationSent ? " A confirmation email has also been sent to you." : ""}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="contactCode"
        value={form.contactCode}
        onChange={(e) => update("contactCode", e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-label">
          Name *
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            maxLength={100}
          />
        </label>
        <label className="form-label">
          Email *
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            maxLength={200}
          />
        </label>
      </div>

      <label className="form-label">
        Organisation / Company
        <input
          className="form-input"
          value={form.organization}
          onChange={(e) => update("organization", e.target.value)}
          maxLength={200}
        />
      </label>

      <label className="form-label">
        What do you need help with? *
        <select
          className="form-input"
          value={form.serviceRequested}
          onChange={(e) => update("serviceRequested", e.target.value)}
          required
        >
          <option value="">Select a service</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="form-label">
        Tell me about your project *
        <textarea
          className="form-input min-h-32"
          value={form.projectDescription}
          onChange={(e) => update("projectDescription", e.target.value)}
          required
          maxLength={5000}
          placeholder="Describe the problem you are solving, the current state of your system, and what you need help with."
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-label">
          Budget range
          <select
            className="form-input"
            value={form.budgetRange}
            onChange={(e) => update("budgetRange", e.target.value)}
          >
            <option value="">Select a range</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Timeline
          <select
            className="form-input"
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
          >
            <option value="">Select a timeline</option>
            {timelineOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-label">
        Website or GitHub URL
        <input
          className="form-input"
          type="url"
          value={form.websiteUrl}
          onChange={(e) => update("websiteUrl", e.target.value)}
          maxLength={500}
          placeholder="https://"
        />
      </label>

      {errorMessage && (
        <p className="text-sm text-rose-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="button button-primary w-full justify-center sm:w-auto"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <LoaderCircle className="animate-spin" size={16} />
        ) : (
          <ArrowRight size={16} />
        )}
        {status === "sending" ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
