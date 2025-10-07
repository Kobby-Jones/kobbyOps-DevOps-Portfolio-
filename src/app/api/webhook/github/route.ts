import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client once per invocation
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const signature = req.headers.get("x-hub-signature-256");
  const body = await req.text();

  // Verify signature
  const hmac = crypto.createHmac("sha256", secret || "");
  const digest = `sha256=${hmac.update(body).digest("hex")}`;
  if (signature !== digest) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const payload = JSON.parse(body);
  const event = req.headers.get("x-github-event");

  const now = new Date().toLocaleString("en-GB", { hour12: false });
  let message = "";

  switch (event) {
    case "push":
      message = `${now} PUSH ${payload.pusher.name} pushed ${payload.commits.length} commit(s) to ${payload.repository.name}`;
      break;
    case "workflow_run":
      message = `${now} CI/CD Workflow '${payload.workflow.name}' ${payload.action}`;
      break;
    case "create":
      message = `${now} REPO Branch '${payload.ref}' created in ${payload.repository.name}`;
      break;
    default:
      message = `${now} EVENT ${event} triggered`;
  }

  // Save to Supabase
  await supabase.from("github_logs").insert({
    event_type: event,
    message,
  });

  console.log("📡 GitHub Event:", message);
  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  const { data, error } = await supabase
    .from("github_logs")
    .select("*")
    .order("id", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ logs: data });
}
