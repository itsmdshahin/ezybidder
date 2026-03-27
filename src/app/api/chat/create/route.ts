// app/api/chat/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (URL / ANON KEY)");
}

function createSupabaseForRequest(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  const headers: Record<string, string> = {};
  if (authHeader) headers["Authorization"] = authHeader;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers },
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseForRequest(req);

    // 1) current user = buyer
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      console.error("[chat/create] auth error:", authError);
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const buyerId = auth.user.id;

    // 2) body data
    const body = await req.json();
    const {
      seller_id,
      vehicle_id,
      auction_id = null,
      message,
    } = body;

    if (!seller_id || !vehicle_id) {
      return NextResponse.json(
        { error: "seller_id and vehicle_id are required" },
        { status: 400 }
      );
    }

    if (seller_id === buyerId) {
      return NextResponse.json(
        { error: "You cannot start a chat with yourself" },
        { status: 400 }
      );
    }

    // 3) আগের থেকে conversation আছে কিনা চেক
    const { data: existingConv, error: existingErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("buyer_id", buyerId)
      .eq("seller_id", seller_id)
      .eq("vehicle_id", vehicle_id)
      .maybeSingle();

    if (existingErr) {
      console.error("[chat/create] existing conversation lookup error:", existingErr);
    }

    let conversationId: string;

    if (existingConv?.id) {
      conversationId = existingConv.id;
    } else {
      // 4) নতুন conversation তৈরি
      const nowIso = new Date().toISOString();

      const { data: newConv, error: insertErr } = await supabase
        .from("conversations")
        .insert({
          buyer_id: buyerId,
          seller_id,
          vehicle_id,
          auction_id,
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select("id")
        .single();

      if (insertErr || !newConv) {
        console.error("[chat/create] insert error:", insertErr);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 }
        );
      }

      conversationId = newConv.id;
    }

    // 5) optional প্রথম মেসেজ
    if (message && String(message).trim().length > 0) {
      const { error: msgErr } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: buyerId,
        recipient_id: seller_id,
        vehicle_id,
        auction_id,
        content: String(message).trim(),
        message_type: "text",
      });

      if (msgErr) {
        console.error("[chat/create] initial message error:", msgErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        conversationId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[chat/create] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
