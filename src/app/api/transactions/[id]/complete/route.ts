// app/api/transactions/[id]/complete/route.ts

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

// Mark a transaction as completed and mark vehicle as sold
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const transactionId = params.id;

  try {
    const supabase = getSupabase(req);

    // Auth – only logged-in user
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const currentUserId = auth.user.id;

    // Load transaction + auction + vehicle
    const { data: tx, error: txErr } = await supabase
      .from("transactions")
      .select(
        `
        *,
        auctions:auction_id (
          id,
          vehicle_id,
          seller_id
        )
      `
      )
      .eq("id", transactionId)
      .single();

    if (txErr || !tx) {
      console.error("[transactions/complete] tx fetch error:", txErr);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Safely resolve IDs from joined auction / transaction
    const buyerId: string = tx.buyer_id;
    const sellerId: string = tx.auctions?.seller_id ?? tx.seller_id;
    const vehicleId: string | null =
      tx.auctions?.vehicle_id ?? tx.vehicle_id ?? null;

    // Only buyer or seller can mark complete
    if (currentUserId !== buyerId && currentUserId !== sellerId) {
      return NextResponse.json(
        { error: "Not allowed to complete this transaction" },
        { status: 403 }
      );
    }

    // 🔁 If already completed, don't spam notifications again
    if (tx.status === "completed") {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        transactionId,
        vehicleId,
      });
    }

    const nowIso = new Date().toISOString();

    // 1) Update transaction status → completed
    const { error: updateTxErr } = await supabase
      .from("transactions")
      .update({
        status: "completed",
        updated_at: nowIso,
      })
      .eq("id", transactionId);

    if (updateTxErr) {
      console.error(
        "[transactions/complete] update tx error:",
        updateTxErr
      );
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      );
    }

    // 2) Mark vehicle as sold (if there is a vehicle)
    if (vehicleId) {
      const { error: vehicleErr } = await supabase
        .from("vehicles")
        .update({
          status: "sold",
          updated_at: nowIso,
        })
        .eq("id", vehicleId);

      if (vehicleErr) {
        console.error(
          "[transactions/complete] vehicle update error:",
          vehicleErr
        );
        // Don't fail the whole operation; transaction is already completed.
      }
    }

    // 3) Optional: send notifications to buyer + seller that payment completed
    try {
      const notificationPayload = [
        {
          user_id: buyerId,
          type: "payment",
          title: "Payment completed",
          message: "Your payment for the vehicle has been completed.",
          priority: "medium",
          action_url: "/dashboard/orders",
        },
        {
          user_id: sellerId,
          type: "payment",
          title: "Sale completed",
          message: "The buyer has completed payment for your vehicle.",
          priority: "medium",
          action_url: "/dashboard/orders",
        },
      ];

      const { error: notifErr } = await supabase
        .from("notifications")
        .insert(notificationPayload);

      if (notifErr) {
        console.error(
          "[transactions/complete] notifications error:",
          notifErr
        );
      }
    } catch (notifCatchErr) {
      console.error(
        "[transactions/complete] notifications unexpected:",
        notifCatchErr
      );
    }

    return NextResponse.json({
      success: true,
      alreadyCompleted: false,
      transactionId,
      vehicleId,
    });
  } catch (err) {
    console.error("[transactions/complete] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
