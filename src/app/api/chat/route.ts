// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (URL / ANON KEY)");
}

// 🔹 Request অনুযায়ী Supabase client (user-এর token respect করবে)
function getSupabase(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

/**
 * GET /api/chat
 * Logged-in user এর সব conversation + last messages + vehicle info
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase(req);

    // current user বের করি
    const { data: auth, error: authErr } = await supabase.auth.getUser();

    if (authErr) {
      console.error("[api/chat] auth error:", authErr);
    }

    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = auth.user.id;

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        created_at,
        buyer_id,
        seller_id,
        vehicle_id,
        auction_id,
        messages (
          id,
          content,
          created_at,
          sender_id,
          read_at
        ),
        vehicles (
          id,
          make,
          model,
          year,
          images
        )
      `
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/chat] conversations error:", error);
      return NextResponse.json(
        { error: "Failed to load conversations" },
        { status: 500 }
      );
    }

    const raw = data || [];

    // message array sort করি (পুরোনো → নতুন)
    const normalized = raw.map((c: any) => {
      const msgs = Array.isArray(c.messages)
        ? [...c.messages].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )
        : [];
      return { ...c, messages: msgs };
    });

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[api/chat][GET] fatal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
