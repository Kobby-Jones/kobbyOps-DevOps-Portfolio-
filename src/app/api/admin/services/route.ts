import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { parseServicePayload } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Unauthorized." }, { status: 401 });
const unavailable = () => NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  try {
    const input = await request.json();
    const payload = parseServicePayload(input as Record<string, unknown>);
    const { id, ...values } = payload;

    const result = id
      ? await supabase.from("services").update(values).eq("id", id).select("*").single()
      : await supabase.from("services").insert(values).select("*").single();

    if (result.error) {
      const status = result.error.code === "23505" ? 409 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ item: result.data }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid service payload." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const supabase = createAdminSupabaseClient();
  if (!supabase) return unavailable();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Service ID is required." }, { status: 400 });

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
