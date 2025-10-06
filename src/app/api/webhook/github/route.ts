export const runtime = "nodejs";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// In-memory log buffer (temporary; later can use Redis or Supabase)
const logs: string[] = [];

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const signature = req.headers.get("x-hub-signature-256");
  const body = await req.text();

  // Verify signature
  const hmac = crypto.createHmac("sha256", secret || "");
  const digest = `sha256=${hmac.update(body).digest("hex")}`;
  const valid =
    signature &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const payload = JSON.parse(body);
  const event = req.headers.get("x-github-event");

  const now = new Date().toLocaleString("en-GB", { hour12: false });
  let message = "";

  switch (event) {
    case "push":
      message = `${now}  PUSH  ${payload.pusher.name} pushed ${payload.commits.length} commit(s) to ${payload.repository.name}`;
      break;
    case "workflow_run":
      message = `${now}  CI/CD  Workflow '${payload.workflow.name}' ${payload.action}`;
      break;
    case "create":
      message = `${now}  REPO  Branch '${payload.ref}' created in ${payload.repository.name}`;
      break;
    default:
      message = `${now}  EVENT  ${event} triggered`;
  }

  logs.unshift(message);
  if (logs.length > 100) logs.pop();

  console.log("📡 GitHub Event:", message);

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({ logs });
}
