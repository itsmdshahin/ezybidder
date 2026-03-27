// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (URL / ANON KEY)");
}

function getSupabase(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

// 🔹 GET – current user notifications
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase(req);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = auth.user.id;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/notifications] error:", error);
      return NextResponse.json(
        { error: "Failed to load notifications" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[GET /api/notifications] fatal:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 🔹 POST – create notification (তুমি chat route থেকে ইউজ করছো)
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase(req);
    const body = await req.json();

    const { user_id, title, message, type, priority, action_url } = body;

    if (!user_id || !title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id,
        title,
        message,
        type,
        priority: priority ?? "low",
        action_url: action_url ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[POST /api/notifications] error:", error);
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[POST /api/notifications] fatal:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 🔹 PATCH – mark notifications as read
// Body: { all?: boolean, id?: string }
export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabase(req);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = auth.user.id;
    const body = await req.json().catch(() => ({} as any));
    const { all, id } = body as { all?: boolean; id?: string };

    let query = supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (!all && id) {
      query = query.eq("id", id);
    }

    const { data, error } = await query.select("*");

    if (error) {
      console.error("[PATCH /api/notifications] error:", error);
      return NextResponse.json(
        { error: "Failed to mark notifications as read" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[PATCH /api/notifications] fatal:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
