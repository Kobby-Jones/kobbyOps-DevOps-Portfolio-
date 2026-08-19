const RESEND_API_URL = "https://api.resend.com/emails";

type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
};

type EmailSendResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: "not_configured" | "provider_error"; error?: string };

export function isTransactionalEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.EMAIL_FROM?.trim(),
  );
}

export async function sendTransactionalEmail(message: EmailMessage): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "cobbinaemmanuel.tech/1.0",
        ...(message.idempotencyKey
          ? { "Idempotency-Key": message.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    const body = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      return {
        ok: false,
        reason: "provider_error",
        error: body.message || body.error?.message || `Email provider returned ${response.status}.`,
      };
    }

    return { ok: true, id: body.id ?? null };
  } catch (error) {
    return {
      ok: false,
      reason: "provider_error",
      error: error instanceof Error ? error.message : "Unknown email provider error.",
    };
  }
}

export function escapeEmailHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
