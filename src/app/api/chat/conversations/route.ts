// app/api/chat/conversations/route.ts

import { supabase } from "@/lib/supabaseServerClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { conversationId: string } }
) {
  const conversationId = context.params.conversationId;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return NextResponse.json(data || []);
}

export async function POST(
  req: NextRequest,
  context: { params: { conversationId: string } }
) {
  const conversationId = context.params.conversationId;
  const body = await req.json();

  const { senderId, recipientId, content } = body;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      message_type: "text",
    })
    .select()
    .single();

  return NextResponse.json(data || {});
}
