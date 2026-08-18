import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateDownloadAccess, isValidDownloadToken } from "../src/lib/download-access.mjs";
import { parsePaystackSuccessEvent, verifyHmacSha512 } from "../src/lib/payment-security.mjs";
import { createSignedSessionToken, verifySignedSessionToken } from "../src/lib/admin-session.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

test("every protected admin API route uses the shared authentication guard", async () => {
  const adminRoot = path.join(root, "src/app/api/admin");
  const entries = await readdir(adminRoot, { withFileTypes: true });
  const intentionallyPublicAdminRoutes = new Set(["login", "logout"]);
  const protectedRoutes = entries.filter((entry) => entry.isDirectory() && !intentionallyPublicAdminRoutes.has(entry.name));

  assert.ok(protectedRoutes.length > 0, "Expected protected admin routes to exist.");

  for (const entry of protectedRoutes) {
    const source = await read(`src/app/api/admin/${entry.name}/route.ts`);
    assert.match(source, /isAdminAuthenticated/, `${entry.name} must import the shared admin auth guard.`);
    assert.match(
      source,
      /await\s+isAdminAuthenticated\s*\(\s*\)/,
      `${entry.name} must invoke the shared admin auth guard.`,
    );
  }
});


test("admin session tokens reject expiry and tampering", () => {
  const secret = "test_admin_session_secret";
  const now = 1_700_000_000;
  const token = createSignedSessionToken(secret, now, 60);

  assert.equal(verifySignedSessionToken(token, secret, now + 30), true);
  assert.equal(verifySignedSessionToken(token, secret, now + 61), false);
  assert.equal(verifySignedSessionToken(`${token.slice(0, -1)}0`, secret, now + 30), false);
  assert.equal(verifySignedSessionToken(token, "wrong-secret", now + 30), false);
});

test("admin session cookies retain production security attributes", async () => {
  for (const route of ["login", "logout"]) {
    const source = await read(`src/app/api/admin/${route}/route.ts`);
    assert.match(source, /httpOnly:\s*true/);
    assert.match(source, /sameSite:\s*"strict"/);
    assert.match(source, /secure:\s*process\.env\.NODE_ENV\s*===\s*"production"/);
  }
});

test("Paystack webhook HMAC verification accepts only the exact signed raw body", () => {
  const secret = "test_webhook_secret";
  const body = JSON.stringify({ event: "charge.success", data: { reference: "order_1" } });
  const signature = createHmac("sha512", secret).update(body).digest("hex");

  assert.equal(verifyHmacSha512(body, signature, secret), true);
  assert.equal(verifyHmacSha512(`${body} `, signature, secret), false);
  assert.equal(verifyHmacSha512(body, "not-a-hex-signature", secret), false);
  assert.equal(verifyHmacSha512(body, signature, "wrong-secret"), false);
});

test("Paystack success events are normalized and unsuccessful events are ignored", () => {
  const success = parsePaystackSuccessEvent(JSON.stringify({
    event: "charge.success",
    data: { reference: "order_42", amount: 12500, currency: "ghs", status: "success" },
  }));

  assert.deepEqual(success, {
    kind: "payment.succeeded",
    reference: "order_42",
    amountMinor: 12500,
    currency: "GHS",
    status: "success",
  });

  assert.deepEqual(parsePaystackSuccessEvent("not json"), { kind: "ignored" });
  assert.deepEqual(parsePaystackSuccessEvent(JSON.stringify({ event: "charge.failed" })), { kind: "ignored" });
});

test("payment webhook route verifies signature before reading or updating orders", async () => {
  const source = await read("src/app/api/webhooks/payment/route.ts");
  const verifyAt = source.indexOf("verifyWebhookSignature");
  const clientAt = source.indexOf("createAdminSupabaseClient()");

  assert.ok(verifyAt >= 0, "Webhook route must verify a signature.");
  assert.ok(clientAt > verifyAt, "Database access must happen after signature verification.");
  assert.match(source, /expectedAmountMinor\s*!==\s*event\.amountMinor/);
  assert.match(source, /expectedCurrency\s*!==\s*event\.currency/);
});

test("download access requires paid status and an unexpired timestamp", () => {
  const now = Date.parse("2026-08-17T12:00:00.000Z");

  assert.equal(
    evaluateDownloadAccess({ status: "paid", downloadExpiresAt: "2026-08-19T11:59:59.000Z" }, now),
    "allowed",
  );
  assert.equal(
    evaluateDownloadAccess({ status: "paid", downloadExpiresAt: "2026-08-17T11:59:59.000Z" }, now),
    "expired",
  );
  assert.equal(
    evaluateDownloadAccess({ status: "pending", downloadExpiresAt: "2026-08-19T11:59:59.000Z" }, now),
    "unauthorized",
  );
  assert.equal(evaluateDownloadAccess({ status: "paid", downloadExpiresAt: null }, now), "expired");
});

test("public resource queries and pages never expose file_url", async () => {
  const contentSource = await read("src/lib/content.ts");
  const publicColumnsMatch = contentSource.match(/const RESOURCE_PUBLIC_COLUMNS\s*=\s*([\s\S]*?);/);
  assert.ok(publicColumnsMatch, "Expected a dedicated public resource column allow-list.");
  assert.doesNotMatch(publicColumnsMatch[1], /file_url/);

  const publicFiles = [
    "src/app/(site)/resources/page.tsx",
    "src/app/(site)/resources/[slug]/page.tsx",
    "src/components/site/ResourceCheckout.tsx",
  ];
  for (const file of publicFiles) {
    assert.doesNotMatch(await read(file), /file_url/, `${file} must not reference file_url.`);
  }

  const migration = await read("supabase/003_commerce_foundation.sql");
  assert.match(migration, /REVOKE\s+SELECT\s+ON\s+(?:TABLE\s+)?public\.resources\s+FROM\s+anon\s*,\s*authenticated/i);
  const publicGrant = migration.match(/GRANT\s+SELECT\s*\(([\s\S]*?)\)\s+ON\s+(?:TABLE\s+)?public\.resources\s+TO\s+anon\s*,\s*authenticated/i);
  assert.ok(publicGrant, "Expected column-level public SELECT grant for resources.");
  assert.doesNotMatch(publicGrant[1], /file_url/i);
});


test("public commerce responses do not serialize private file locations or order download tokens", async () => {
  const checkout = await read("src/app/api/checkout/route.ts");
  const paidDownload = await read("src/app/api/download/[token]/route.ts");
  const freeDownload = await read("src/app/api/download/free/[slug]/route.ts");
  const adminOrders = await read("src/app/api/admin/orders/route.ts");

  assert.doesNotMatch(checkout, /NextResponse\.json\(\s*resource/);
  assert.doesNotMatch(checkout, /NextResponse\.json\(\s*\{[^}]*file_url/s);
  assert.match(checkout, /\{ paymentUrl: session\.authorizationUrl \}/);

  for (const source of [paidDownload, freeDownload]) {
    assert.doesNotMatch(source, /redirect\s*\(/i, "Downloads must stream/proxy instead of redirecting to file_url.");
    assert.doesNotMatch(source, /Location\s*[:=]/i, "Downloads must not disclose the upstream file URL in a Location header.");
    assert.match(source, /proxyFileDownload/);
  }

  assert.doesNotMatch(adminOrders, /download_token/);
  assert.doesNotMatch(adminOrders, /download_expires_at/);
});

test("download tokens must use the generated UUID v4 format", () => {
  assert.equal(isValidDownloadToken("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidDownloadToken("550e8400-e29b-11d4-a716-446655440000"), false);
  assert.equal(isValidDownloadToken("../../private-file"), false);
  assert.equal(isValidDownloadToken("not-a-token"), false);
});

test("download route uses the centralized expiry/status decision", async () => {
  const source = await read("src/app/api/download/[token]/route.ts");
  assert.match(source, /evaluateDownloadAccess/);
  assert.match(source, /access\s*===\s*"unauthorized"/);
  assert.match(source, /access\s*===\s*"expired"/);
});

test("S3 asset library keeps AWS credentials and storage coordinates server-side", async () => {
  const env = await read(".env.example");
  assert.match(env, /AWS_ACCESS_KEY_ID=/);
  assert.match(env, /AWS_SECRET_ACCESS_KEY=/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_AWS_ACCESS_KEY_ID=/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=/);

  const contentSource = await read("src/lib/content.ts");
  const publicColumnsMatch = contentSource.match(/const RESOURCE_PUBLIC_COLUMNS\s*=\s*([\s\S]*?);/);
  assert.ok(publicColumnsMatch);
  assert.doesNotMatch(publicColumnsMatch[1], /file_asset_id|s3_key|bucket/);

  for (const file of [
    "src/app/(site)/resources/page.tsx",
    "src/app/(site)/resources/[slug]/page.tsx",
    "src/components/site/MarkdownArticle.tsx",
  ]) {
    const source = await read(file);
    assert.doesNotMatch(source, /AWS_SECRET_ACCESS_KEY|s3_key|file_asset_id/);
  }
});

test("S3 uploads require admin auth and public media cannot serve resource files", async () => {
  for (const file of [
    "src/app/api/admin/assets/route.ts",
    "src/app/api/admin/assets/presign/route.ts",
    "src/app/api/admin/assets/sync/route.ts",
    "src/app/api/admin/prepared-resources/route.ts",
  ]) {
    const source = await read(file);
    assert.match(source, /isAdminAuthenticated/);
    assert.match(source, /await\s+isAdminAuthenticated\s*\(\s*\)/);
  }

  const presign = await read("src/app/api/admin/assets/presign/route.ts");
  assert.match(presign, /createPresignedUpload/);
  const media = await read("src/app/api/media/[id]/route.ts");
  assert.match(media, /MEDIA_TYPES/);
  assert.doesNotMatch(media.match(/const MEDIA_TYPES[\s\S]*?;/)?.[0] || "", /resource_file/);

  const migration = await read("supabase/005_s3_asset_library.sql");
  assert.match(migration, /alter table public\.media_assets enable row level security/i);
  assert.match(migration, /alter table public\.prepared_resources enable row level security/i);
});
