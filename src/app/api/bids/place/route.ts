import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars not configured");
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

// For quick sanity check in browser: http://localhost:4028/api/bid/place
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/bids/place" });
}

export async function POST(req: NextRequest) {
  let supabase;
  try {
    supabase = getSupabase(req);
  } catch (cfgErr: any) {
    console.error("[/api/bids/place] config error:", cfgErr);
    return NextResponse.json(
      { ok: false, error: cfgErr?.message || "Supabase not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      auction_id?: string;
      amount?: number;
    };

    const { auction_id, amount } = body;

    if (!auction_id || typeof amount !== "number") {
      return NextResponse.json(
        { ok: false, error: "auction_id and amount are required" },
        { status: 400 }
      );
    }

    // 🔐 Auth
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth?.user) {
      console.error("[/api/bids/place] auth error:", authErr);
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    const userId = auth.user.id;

    // 🔹 Load auction
    const { data: auction, error: auctionErr } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", auction_id)
      .single();

    if (auctionErr || !auction) {
      console.error("[/api/bids/place] auction fetch error:", auctionErr);
      return NextResponse.json(
        { ok: false, error: "Auction not found" },
        { status: 404 }
      );
    }

    // status / time guards
    if (auction.status === "ended" || auction.status === "cancelled") {
      return NextResponse.json(
        { ok: false, error: "This auction has already ended" },
        { status: 400 }
      );
    }

    const now = Date.now();
    const end = new Date(auction.end_time).getTime();
    if (now >= end) {
      return NextResponse.json(
        { ok: false, error: "This auction has already ended" },
        { status: 400 }
      );
    }

    // 🔹 Min allowed bid
    const currentBidNumber = Number(
      auction.current_bid ?? auction.starting_price ?? 0
    );
    const incrementNumber = Number(auction.bid_increment ?? 50);
    const minAllowed = currentBidNumber + incrementNumber;

    if (amount < minAllowed) {
      return NextResponse.json(
        {
          ok: false,
          error: `Bid must be at least ${minAllowed}`,
          minAllowed,
        },
        { status: 400 }
      );
    }

    // 🔹 Insert bid
    const { data: bid, error: bidErr } = await supabase
      .from("bids")
      .insert({
        auction_id,
        bidder_id: userId,
        amount,
        max_bid: null,
        is_proxy_bid: false,
        is_winning: true,
      })
      .select("*")
      .single();

    if (bidErr || !bid) {
      console.error("[/api/bids/place] insert error:", bidErr);
      return NextResponse.json(
        {
          ok: false,
          error:
            bidErr?.message ||
            "Failed to place bid (check foreign keys / RLS).",
        },
        { status: 400 }
      );
    }

    // 🔹 Mark previous bids as not winning
    const { error: markErr } = await supabase
      .from("bids")
      .update({ is_winning: false })
      .eq("auction_id", auction_id)
      .neq("id", bid.id);

    if (markErr) {
      console.error("[/api/bids/place] mark previous bids error:", markErr);
    }

    const newTotalBids = Number(auction.total_bids ?? 0) + 1;
    const reservePrice =
      auction.reserve_price !== null
        ? Number(auction.reserve_price)
        : null;
    const reserveMet =
      reservePrice == null ? true : Number(amount) >= reservePrice;

    // 🔹 Update auction
    const { error: auctionUpdateErr } = await supabase
      .from("auctions")
      .update({
        current_bid: amount,
        winner_id: userId,
        total_bids: newTotalBids,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auction_id);

    if (auctionUpdateErr) {
      console.error(
        "[/api/bids/place] auction update error:",
        auctionUpdateErr
      );
    }

    return NextResponse.json({
      ok: true,
      bid,
      currentBid: amount,
      totalBids: newTotalBids,
      reserveMet,
    });
  } catch (e: any) {
    console.error("[/api/bids/place] fatal error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
