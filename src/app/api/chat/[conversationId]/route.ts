// src/app/api/chat/[conversationId]/route.ts
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

/**
 * GET /api/chat/:conversationId
 * Get all messages in a conversation
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = getSupabase(req);

    // ✅ auth check (same as আগে)
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { conversationId } = params;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[GET /api/chat/:id]", error);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[GET /api/chat/:id] fatal", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/:conversationId
 * Send a message + create notification
 * Body: { recipientId: string, content: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const supabase = getSupabase(req);

    // ✅ auth check
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const senderId = auth.user.id;
    const { conversationId } = params;

    const body = await req.json();
    const { recipientId, content } = body;

    if (!recipientId || !content?.trim()) {
      return NextResponse.json(
        { error: "Missing recipientId or content" },
        { status: 400 }
      );
    }

    const cleanContent = content.trim();

    // 🔹 (optional) conversation load – যদি vehicle_id / auction_id না লাগে, এটা skip করতে পারো
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (convErr) {
      console.error("[POST /api/chat/:id] conversation load error:", convErr);
    }

    // 🔹 message insert – এই অংশ তোমার পুরোনো logic-এর মত
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        recipient_id: recipientId,
        vehicle_id: conv?.vehicle_id ?? null,
        auction_id: conv?.auction_id ?? null,
        content: cleanContent,
        message_type: "text",
      })
      .select("*")
      .single();

    if (error || !data) {
      console.error("[POST /api/chat/:id] message insert error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // 🔔 notification insert – SAME anon client, no service role
    try {
      const preview =
        cleanContent.length > 140
          ? cleanContent.slice(0, 137) + "..."
          : cleanContent;

      await supabase.from("notifications").insert({
        user_id: recipientId,
        type: "message",
        title: "New message received",
        message: preview,
        action_url: `/chat/${conversationId}`,
        priority: "low",
      });
    } catch (notifErr) {
      // notification fail হলেও message যেন fail না হয়
      console.error(
        "[POST /api/chat/:id] notification insert error:",
        notifErr
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[POST /api/chat/:id] fatal", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
