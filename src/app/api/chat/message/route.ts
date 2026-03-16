// app/api/chat/message/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServerClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    conversation_id,
    sender_id,
    recipient_id,
    vehicle_id,
    auction_id,
    content,
  } = body;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id,
      sender_id,
      recipient_id,
      vehicle_id,
      auction_id,
      content,
      message_type: "text",
    })
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}
