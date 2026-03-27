// src/lib/auctionsStore.ts
// FIXED: was empty — watch/unwatch API routes imported from here and crashed
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getAuction(auctionId: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from('auctions').select('*').eq('id', auctionId).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function watchAuction(auctionId: string, _userId: string) {
  const supabase = getAdminClient();
  const { data: auction, error: fetchErr } = await supabase
    .from('auctions').select('id, watchers').eq('id', auctionId).single();
  if (fetchErr || !auction) throw new Error(fetchErr?.message || 'Auction not found');
  const newWatchers = Number(auction.watchers ?? 0) + 1;
  const { data, error: updateErr } = await supabase
    .from('auctions')
    .update({ watchers: newWatchers, updated_at: new Date().toISOString() })
    .eq('id', auctionId).select('id, watchers').single();
  if (updateErr) throw new Error(updateErr.message);
  return data;
}

export async function unwatchAuction(auctionId: string, _userId: string) {
  const supabase = getAdminClient();
  const { data: auction, error: fetchErr } = await supabase
    .from('auctions').select('id, watchers').eq('id', auctionId).single();
  if (fetchErr || !auction) throw new Error(fetchErr?.message || 'Auction not found');
  const newWatchers = Math.max(0, Number(auction.watchers ?? 0) - 1);
  const { data, error: updateErr } = await supabase
    .from('auctions')
    .update({ watchers: newWatchers, updated_at: new Date().toISOString() })
    .eq('id', auctionId).select('id, watchers').single();
  if (updateErr) throw new Error(updateErr.message);
  return data;
}