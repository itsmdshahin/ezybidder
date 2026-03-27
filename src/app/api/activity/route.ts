// app/api/activity/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseServerClient';


export async function GET() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userId = auth.user.id;

  // 1 — User bids
  const { data: bidActivity } = await supabase
    .from('bids')
    .select('id, amount, created_at, auction_id')
    .eq('bidder_id', userId)
    .order('created_at', { ascending: false });

  // 2 — Their listings activity
  const { data: listingActivity } = await supabase
    .from('auctions')
    .select('id, status, created_at, winner_id')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  // 3 — Payments (transactions)
  const { data: payments } = await supabase
    .from('transactions')
    .select('*')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  // Format unified feed
  const feed = [];

  bidActivity?.forEach(b => feed.push({
    type: 'bid',
    title: 'Bid placed',
    description: `You placed a bid of £${b.amount}`,
    timestamp: b.created_at,
    status: 'success'
  }));

  listingActivity?.forEach(l => feed.push({
    type: 'listing',
    title: 'Listing update',
    description: `Your listing is now ${l.status}`,
    timestamp: l.created_at,
    status: l.status === 'active' ? 'success' : 'pending'
  }));

  payments?.forEach(p => feed.push({
    type: 'payment',
    title: 'Payment processed',
    description: p.transaction_type,
    amount: `£${p.amount}`,
    timestamp: p.created_at,
    status: p.status
  }));

  feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json(feed);
}
