import { escapeEmailHtml, sendTransactionalEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";

type ConsultationEmailPayload = {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  service_requested: string;
  project_description: string;
  budget_range?: string | null;
  timeline?: string | null;
  website_url?: string | null;
};

const brand = {
  background: "#09090b",
  panel: "#18181b",
  border: "#27272a",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  accent: "#14b8a6",
};

function field(label: string, value: string) {
  return `<tr><td style="padding:8px 14px 8px 0;color:${brand.muted};font-size:13px;vertical-align:top;white-space:nowrap">${escapeEmailHtml(label)}</td><td style="padding:8px 0;color:${brand.text};font-size:14px;line-height:1.6">${escapeEmailHtml(value)}</td></tr>`;
}

function page(content: string) {
  return `<!doctype html><html><body style="margin:0;background:${brand.background};font-family:Arial,Helvetica,sans-serif;color:${brand.text}"><div style="max-width:680px;margin:0 auto;padding:32px 18px"><div style="margin-bottom:18px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${brand.accent}">KobbyOps · cobbinaemmanuel.tech</div><div style="background:${brand.panel};border:1px solid ${brand.border};border-radius:16px;padding:28px">${content}</div><p style="margin:18px 4px 0;color:${brand.muted};font-size:12px;line-height:1.6">Sent by cobbinaemmanuel.tech.</p></div></body></html>`;
}

export async function sendConsultationEmails(payload: ConsultationEmailPayload) {
  const notificationEmail =
    process.env.CONSULTATION_NOTIFICATION_EMAIL?.trim() || siteConfig.email;

  const safeName = escapeEmailHtml(payload.name);
  const safeService = escapeEmailHtml(payload.service_requested);
  const adminSubject = `New consultation request: ${payload.service_requested} — ${payload.name}`;

  const adminText = [
    "New consultation request",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Organisation: ${payload.organization || "N/A"}`,
    `Service: ${payload.service_requested}`,
    `Budget: ${payload.budget_range || "N/A"}`,
    `Timeline: ${payload.timeline || "N/A"}`,
    `Website/GitHub: ${payload.website_url || "N/A"}`,
    "",
    "Project description:",
    payload.project_description,
    "",
    `Lead ID: ${payload.id}`,
    `Admin: ${siteConfig.url}/admin`,
  ].join("\n");

  const adminHtml = page(`
    <h1 style="margin:0 0 8px;font-size:24px;line-height:1.3;color:${brand.text}">New consultation request</h1>
    <p style="margin:0 0 22px;color:${brand.muted};font-size:14px;line-height:1.7">${safeName} submitted a request for <strong style="color:${brand.text}">${safeService}</strong>.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse">${field("Name", payload.name)}${field("Email", payload.email)}${field("Organisation", payload.organization || "N/A")}${field("Service", payload.service_requested)}${field("Budget", payload.budget_range || "N/A")}${field("Timeline", payload.timeline || "N/A")}${field("Website / GitHub", payload.website_url || "N/A")}</table>
    <div style="height:1px;background:${brand.border};margin:22px 0"></div>
    <p style="margin:0 0 8px;color:${brand.muted};font-size:13px">Project description</p>
    <div style="white-space:pre-wrap;color:${brand.text};font-size:14px;line-height:1.75">${escapeEmailHtml(payload.project_description)}</div>
    <div style="margin-top:24px"><a href="${siteConfig.url}/admin" style="display:inline-block;background:${brand.accent};color:#042f2e;text-decoration:none;font-weight:700;font-size:13px;padding:11px 16px;border-radius:9px">Open Admin Leads</a></div>
  `);

  const admin = await sendTransactionalEmail({
    to: notificationEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText,
    replyTo: payload.email,
    idempotencyKey: `consultation-admin-${payload.id}`,
  });

  const confirmationSubject = `I received your consultation request — ${siteConfig.name}`;
  const confirmationText = [
    `Hi ${payload.name},`,
    "",
    "Thank you for reaching out through cobbinaemmanuel.tech. Your consultation request has been received.",
    "",
    `Service: ${payload.service_requested}`,
    `Timeline: ${payload.timeline || "Not specified"}`,
    "",
    "I review serious inquiries personally and will respond within 1–2 business days.",
    "",
    `Regards,`,
    siteConfig.name,
    siteConfig.url,
  ].join("\n");

  const confirmationHtml = page(`
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:${brand.text}">Request received</h1>
    <p style="margin:0 0 14px;color:${brand.text};font-size:15px;line-height:1.75">Hi ${safeName},</p>
    <p style="margin:0 0 20px;color:${brand.muted};font-size:14px;line-height:1.75">Thank you for reaching out through cobbinaemmanuel.tech. Your consultation request has been received, and I review serious inquiries personally.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse">${field("Service", payload.service_requested)}${field("Timeline", payload.timeline || "Not specified")}</table>
    <p style="margin:22px 0 0;color:${brand.muted};font-size:14px;line-height:1.75">I will respond within 1–2 business days.</p>
    <p style="margin:22px 0 0;color:${brand.text};font-size:14px;line-height:1.7">Regards,<br><strong>${escapeEmailHtml(siteConfig.name)}</strong></p>
  `);

  const confirmation = await sendTransactionalEmail({
    to: payload.email,
    subject: confirmationSubject,
    html: confirmationHtml,
    text: confirmationText,
    replyTo: notificationEmail,
    idempotencyKey: `consultation-confirmation-${payload.id}`,
  });

  return { admin, confirmation };
}
