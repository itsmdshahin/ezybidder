'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BidHistoryCard from './BidHistoryCard';
import PaginationControls from './PaginationControls';

const PAGE_SIZE = 8;

export default function BidHistoryClient() {
  const [user, setUser] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchBids();
  }, [user, page, search, statusFilter]);

  async function fetchBids() {
    setLoading(true);

    const fromIdx = (page - 1) * PAGE_SIZE;
    const toIdx = fromIdx + PAGE_SIZE - 1;

    let query = supabase
      .from('bids')
      .select(
        `
          id,
          amount,
          max_bid,
          is_proxy_bid,
          is_winning,
          bid_time,
          auction_id,
          auctions (
            id,
            start_time,
            end_time,
            status,
            vehicles (
              id,
              make,
              model,
              year,
              images,
              price,
              vrm
            )
          )
        `
      )
      .eq('bidder_id', user.id)
      .order('bid_time', { ascending: false })
      .range(fromIdx, toIdx);

    const { data, error } = await query;

    if (!error && data) {
      let filtered = data;

      // Search by make / model / VRM
      if (search) {
        filtered = filtered.filter((b: any) => {
          const v = b.auctions?.vehicles;
          if (!v) return false;
          const hay = `${v.make} ${v.model} ${v.vrm}`.toLowerCase();
          return hay.includes(search.toLowerCase());
        });
      }

      // Status filter (won / lost / leading)
      if (statusFilter) {
        if (statusFilter === 'won') {
          filtered = filtered.filter((b) => b.is_winning === true);
        } else if (statusFilter === 'lost') {
          filtered = filtered.filter((b) => b.is_winning === false);
        }
      }

      setTotal(filtered.length);
      setBids(filtered);
    }

    setLoading(false);
  }

  return (
    <div>
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Bid History</h1>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-border rounded-md bg-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input"
          >
            <option value="">All results</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="leading">Leading</option>
          </select>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="p-6 bg-card rounded-lg animate-pulse h-48" />
          ))}
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg border">
          <p>No bids found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((b: any) => (
            <BidHistoryCard key={b.id} bid={b} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
