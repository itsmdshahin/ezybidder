// app/api/auctions/[id]/finalize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!;

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

// quick test: /api/auctions/<id>/finalize in browser
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ ok: true, auctionId: params.id });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auctionId = params.id;

  let supabase;
  try {
    supabase = getSupabase(req);
  } catch (cfgErr: any) {
    console.error("[finalize] config error:", cfgErr);
    return NextResponse.json(
      { error: cfgErr?.message || "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    // 0) Auth – only logged-in user
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const currentUserId = auth.user.id;

    // 1) Load auction
    const { data: auction, error: auctionErr } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", auctionId)
      .single();

    if (auctionErr || !auction) {
      console.error("[finalize] auction fetch error:", auctionErr);
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    const sellerId: string = auction.seller_id;
    const vehicleId: string | null = auction.vehicle_id;
    let winnerId: string | null = auction.winner_id ?? null;

    // ✅ only seller can finalize
    if (currentUserId !== sellerId) {
      return NextResponse.json(
        { error: "Only the seller can finalize this auction" },
        { status: 403 }
      );
    }

    // 🔁 If already ended, don't create anything again
    if (auction.status === "ended") {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("auction_id", auctionId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      return NextResponse.json({
        success: true,
        alreadyFinalized: true,
        status: "ended",
        winnerId: winnerId ?? null,
        conversationId: existingConv?.id ?? null,
      });
    }

    // 2) If winner_id not set yet, derive from highest bid
    if (!winnerId) {
      const { data: highestBid, error: bidsErr } = await supabase
        .from("bids")
        .select("bidder_id, amount")
        .eq("auction_id", auctionId)
        .order("amount", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (bidsErr) {
        console.error("[finalize] bids fetch error:", bidsErr);
      }

      if (highestBid?.bidder_id) {
        winnerId = highestBid.bidder_id;
      }
    }

    const nowIso = new Date().toISOString();

    // 3) Update auction as ended
    const { error: updateErr } = await supabase
      .from("auctions")
      .update({
        status: "ended",
        winner_id: winnerId,
        updated_at: nowIso,
      })
      .eq("id", auctionId);

    if (updateErr) {
      console.error("[finalize] auction update error:", updateErr);
      return NextResponse.json(
        { error: "Failed to update auction status" },
        { status: 500 }
      );
    }

    // If no winner -> nothing to chat about
    if (!winnerId) {
      return NextResponse.json({
        success: true,
        status: "ended",
        winnerId: null,
        conversationId: null,
      });
    }

    // 4) Find existing conversation for this auction
    const { data: existingConv, error: convErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("auction_id", auctionId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (convErr) {
      console.error("[finalize] conversation lookup error:", convErr);
    }

    let conversationId: string;

    if (existingConv?.id) {
      conversationId = existingConv.id;
    } else {
      // 5) Create new conversation
      const { data: newConv, error: convInsertErr } = await supabase
        .from("conversations")
        .insert({
          buyer_id: winnerId,
          seller_id: sellerId,
          vehicle_id: vehicleId,
          auction_id: auctionId,
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select("id")
        .single();

      if (convInsertErr || !newConv) {
        console.error("[finalize] conversation insert error:", convInsertErr);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 }
        );
      }

      conversationId = newConv.id;
    }

    // 6) Ensure only ONE system message per conversation
    const { data: existingSystemMsg } = await supabase
      .from("messages")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("message_type", "system")
      .limit(1)
      .maybeSingle();

    if (!existingSystemMsg) {
      const systemContent =
        "Auction completed – you can now arrange payment and collection here.";

      const { error: msgErr } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: sellerId,
        recipient_id: winnerId,
        vehicle_id: vehicleId,
        auction_id: auctionId,
        content: systemContent,
        message_type: "system",
      });

      if (msgErr) {
        console.error("[finalize] system message insert error:", msgErr);
      }
    }

    return NextResponse.json({
      success: true,
      alreadyFinalized: false,
      status: "ended",
      winnerId,
      conversationId,
    });
  } catch (err) {
    console.error("[finalize] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
