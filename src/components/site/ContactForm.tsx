"use client";

import { useState } from "react";
import { LoaderCircle, Send, CheckCircle2 } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("submitting");
    setMessage("");
    try {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.fallback) {
        window.location.href = result.fallback;
        setState("idle");
        return;
      }

      if (!response.ok) {
        setState("error");
        setMessage(result.error || "The message could not be sent. Please use email instead.");
        return;
      }

      setState("success");
      setMessage("Thank you. Your message has been received.");
      const form = document.getElementById("contact-form") as HTMLFormElement | null;
      form?.reset();
    } catch {
      setState("error");
      setMessage("The network request failed. Please use the email link instead.");
    }
  }

  return (
    <form id="contact-form" action={submit} className="surface-card p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-label">
          Name
          <input className="form-input" name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className="form-label">
          Email
          <input className="form-input" type="email" name="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className="form-label mt-5">
        Subject
        <input className="form-input" name="subject" required maxLength={160} />
      </label>
      <label className="form-label mt-5">
        Message
        <textarea className="form-input min-h-40 resize-y" name="message" required maxLength={5000} />
      </label>
      <label className="sr-only" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button className="button button-primary" disabled={state === "submitting"} type="submit">
          {state === "submitting" ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />}
          {state === "submitting" ? "Sending" : "Send message"}
        </button>
        {message && (
          <p className={`inline-flex items-center gap-2 text-sm ${state === "success" ? "text-emerald-400" : "text-rose-400"}`} role="status">
            {state === "success" && <CheckCircle2 size={16} />} {message}
          </p>
        )}
      </div>
    </form>
  );
}
