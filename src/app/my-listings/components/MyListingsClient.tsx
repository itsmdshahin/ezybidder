'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ListingCard from './ListingCard';
import ListingFormModal from './ListingFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PaginationControls from './PaginationControls';

type AuctionRow = {
  id: string | null;           // auction না থাকলে null
  vehicle_id: string;
  seller_id: string;
  starting_price: number;
  reserve_price: number | null;
  current_bid: number;
  bid_increment: number;
  start_time: string | null;
  end_time: string | null;
  status: string;
  winner_id?: string | null;
  total_bids?: number;
  watchers?: number;
  created_at?: string;
  updated_at?: string;
  vehicles?: {
    id: string;
    title?: string | null;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    mileage?: number | null;
    price?: number | null;
    reserve_price?: number | null;
    listing_type?: string | null;
    images?: string[] | null;
    vrm?: string | null;
    status?: string | null;
    description?: string | null;
    location?: string | null;
  };
};

const PAGE_SIZE = 8;

export default function MyListingsClient() {
  const [user, setUser] = useState<any | null>(null);
  const [listings, setListings] = useState<AuctionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | ''>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingListing, setEditingListing] = useState<AuctionRow | null>(null);
  const [deletingListing, setDeletingListing] = useState<AuctionRow | null>(null);

  // current user লোড
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(data?.user ?? null);
    };
    init();
  }, []);

  // user, page, search, statusFilter change হলে fetch
  useEffect(() => {
    if (!user) return;

    fetchListings();

    // realtime শুধু auctions এ change হলে আবার fetch
    const channel = supabase
      .channel('public:auctions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
          filter: `seller_id=eq.${user.id}`,
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, search, statusFilter]);

  async function fetchListings() {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/listings?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to load listings');
      }

      const json: {
        listings: AuctionRow[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      } = await res.json();

      setListings(json.listings || []);
      setTotal(json.pagination?.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // CREATE or UPDATE - এখনো direct supabase ব্যবহার করছো (তোমার পুরনো লজিক)
  const handleUpsertListing = async (values: Partial<AuctionRow> & { vehicle?: any }) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    setError(null);

    try {
      let vehicleId = values.vehicle_id;

      if (!vehicleId && values.vehicle) {
        const { data: vdata, error: verr } = await supabase
          .from('vehicles')
          .insert([{ ...values.vehicle, seller_id: user.id }])
          .select('id')
          .single();
        if (verr) throw verr;
        vehicleId = vdata.id;
      }

      const row = {
        vehicle_id: vehicleId,
        seller_id: user.id,
        starting_price: values.starting_price ?? 0,
        reserve_price: values.reserve_price ?? 0,
        bid_increment: values.bid_increment ?? 50,
        start_time: values.start_time ?? new Date().toISOString(),
        end_time: values.end_time ?? null,
        status: values.status ?? 'draft',
        updated_at: new Date().toISOString(),
      };

      if (values.id) {
        const { error: uerr } = await supabase.from('auctions').update(row).eq('id', values.id);
        if (uerr) throw uerr;
      } else {
        const { error: cerr } = await supabase.from('auctions').insert([{ ...row }]);
        if (cerr) throw cerr;
      }

      await fetchListings();
      setShowAddModal(false);
      setEditingListing(null);
      return { error: null };
    } catch (err: any) {
      console.error(err);
      setError(err.message || String(err));
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // DELETE auction (vehicle নিজে delete করছো না এখন)
  const handleDelete = async (listingId: string | null) => {
    if (!listingId) return;
    setLoading(true);
    setError(null);
    try {
      const { error: derr } = await supabase.from('auctions').delete().eq('id', listingId);
      if (derr) throw derr;
      await fetchListings();
      setDeletingListing(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Listings</h1>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search make, model or VRM..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-border rounded-md bg-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-input"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="ended">Ended</option>
            <option value="draft">Draft</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            + Add listing
          </button>
        </div>
      </div>

      {error && <div className="text-error mb-4">Error: {error}</div>}

      {/* Listing grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="p-6 bg-card rounded-lg animate-pulse h-48" />
          ))
        ) : listings.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-card rounded-lg">
            <p>No listings yet. Create your first listing!</p>
          </div>
        ) : (
          listings.map((l) => (
            <ListingCard
              key={`${l.vehicle_id}-${l.id ?? 'no-auction'}`}
              listing={l}
              onEdit={() => {
                setEditingListing(l);
                setShowAddModal(true);
              }}
              onDelete={() => setDeletingListing(l)}
            />
          ))
        )}
      </div>

      <div className="mt-6">
        <PaginationControls
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Add/Edit modal */}
      {showAddModal && (
        <ListingFormModal
          initialData={editingListing}
          onClose={() => {
            setShowAddModal(false);
            setEditingListing(null);
          }}
          onSave={handleUpsertListing}
        />
      )}

      {/* Delete confirmation */}
      {deletingListing && (
        <DeleteConfirmModal
          title="Delete listing"
          description={`Delete listing for vehicle ${
            deletingListing.vehicles?.make ?? ''
          } ${deletingListing.vehicles?.model ?? ''}? This cannot be undone.`}
          onConfirm={() => handleDelete(deletingListing.id)}
          onClose={() => setDeletingListing(null)}
        />
      )}
    </div>
  );
}
