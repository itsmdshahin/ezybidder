// app/api/chat/messages/[conversationId]/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServerClient";

export async function GET() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json([], { status: 200 });

  const userId = auth.user.id;

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      buyer_id,
      seller_id,
      vehicle_id,
      auction_id,
      messages (
        content,
        created_at,
        sender_id,
        read_at
      ),
      vehicles (
        id, make, model, year, images
      )
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  return NextResponse.json(data || []);
}
