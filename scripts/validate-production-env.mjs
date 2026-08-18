import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "ANALYTICS_SALT",
  "PAYMENT_SECRET_KEY",
  "PAYMENT_PUBLIC_KEY",
  "PAYMENT_WEBHOOK_SECRET",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_RESOURCE_BUCKET",
  "AWS_S3_MEDIA_BUCKET",
];

const missing = required.filter((name) => !String(process.env[name] || "").trim());
if (missing.length) {
  console.error(`Missing required production environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
try {
  const parsed = new URL(publicSiteUrl);
  if (parsed.protocol !== "https:") throw new Error("not https");
} catch {
  console.error("NEXT_PUBLIC_SITE_URL must be a valid HTTPS URL in production.");
  process.exit(1);
}

const forbiddenPublicSecrets = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_ADMIN_PASSWORD",
  "NEXT_PUBLIC_ADMIN_SESSION_SECRET",
  "NEXT_PUBLIC_ANALYTICS_SALT",
  "NEXT_PUBLIC_PAYMENT_SECRET_KEY",
  "NEXT_PUBLIC_PAYMENT_WEBHOOK_SECRET",
  "NEXT_PUBLIC_AWS_ACCESS_KEY_ID",
  "NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY",
];

const exposed = forbiddenPublicSecrets.filter((name) => String(process.env[name] || "").trim());
if (exposed.length) {
  console.error(`Server-only secrets must not use NEXT_PUBLIC_: ${exposed.join(", ")}`);
  process.exit(1);
}

console.log("Production environment variables are present and structurally valid.");
