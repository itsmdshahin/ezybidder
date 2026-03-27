// src/app/live-auction/components/LiveAuctionsBrowser.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AuctionHeader from './AuctionHeader';
import LiveAuctionInteractive from './LiveAuctionInteractive';
import Icon from '@/components/ui/AppIcon';

type UIVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  bodyType: string;
  transmission: string;
  image: string;
  alt: string;
  location?: string | null;
};

type LiveAuctionItem = {
  id: string;
  vehicleId: string;
  currentBid: number;
  startingPrice: number;
  reservePrice: number | null;
  bidIncrement: number;
  endTime: string;
  startTime: string;
  status: string;
  totalBids: number;
  watchers: number;
  vehicle: UIVehicle;
};

interface LiveAuctionsBrowserProps {
  initialVehicleId?: string | null;
}

const LiveAuctionsBrowser = ({ initialVehicleId }: LiveAuctionsBrowserProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<LiveAuctionItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchAuctions = async () => {
      setLoading(true);
      setError(null);

      try {
        const nowIso = new Date().toISOString();

        const { data, error: dbError } = await supabase
          .from('auctions')
          .select(
            `
            id,
            vehicle_id,
            starting_price,
            reserve_price,
            current_bid,
            bid_increment,
            start_time,
            end_time,
            status,
            total_bids,
            watchers,
            vehicles (
              id,
              title,
              make,
              model,
              year,
              mileage,
              fuel_type,
              body_type,
              transmission,
              images,
              location
            )
          `,
          )
          .eq('status', 'active')
          .lte('start_time', nowIso)
          .gte('end_time', nowIso)
          .order('end_time', { ascending: true });

        if (dbError) {
          console.error('[live-auction] fetch error:', dbError);
          setError('Failed to load live auctions.');
          setAuctions([]);
          setLoading(false);
          return;
        }

        if (!data || !Array.isArray(data)) {
          setAuctions([]);
          setLoading(false);
          return;
        }

        const mapped: LiveAuctionItem[] = data.map((row: any) => {
          const v = row.vehicles || {};
          const images: string[] = Array.isArray(v.images) ? v.images : [];
          const mainImage = images[0] ?? '';

          const uiVehicle: UIVehicle = {
            id: v.id,
            make: v.make ?? 'Unknown',
            model: v.model ?? '',
            year: Number(v.year) || 0,
            mileage: Number(v.mileage) || 0,
            fuelType: (v.fuel_type ?? '').toString().toLowerCase() || 'petrol',
            bodyType: v.body_type ?? 'Hatchback',
            transmission: v.transmission ?? 'automatic',
            image: mainImage,
            alt:
              v.title ||
              `${v.year ?? ''} ${v.make ?? ''} ${v.model ?? ''}`.trim(),
            location: v.location ?? null,
          };

          return {
            id: row.id,
            vehicleId: row.vehicle_id,
            startingPrice: Number(row.starting_price ?? 0),
            reservePrice:
              row.reserve_price !== null
                ? Number(row.reserve_price)
                : null,
            currentBid: Number(row.current_bid ?? row.starting_price ?? 0),
            bidIncrement: Number(row.bid_increment ?? 50),
            startTime: row.start_time,
            endTime: row.end_time,
            status: row.status,
            totalBids: Number(row.total_bids ?? 0),
            watchers: Number(row.watchers ?? 0),
            vehicle: uiVehicle,
          };
        });

        setAuctions(mapped);

        // ✅ Auto select auction: prefer one matching vehicleId, else first
        if (mapped.length > 0) {
          let defaultAuction: LiveAuctionItem | undefined = mapped[0];

          if (initialVehicleId) {
            const match = mapped.find(
              (a) => a.vehicleId === initialVehicleId,
            );
            if (match) defaultAuction = match;
          }

          setSelectedId(defaultAuction?.id ?? null);
        }
      } catch (err) {
        console.error('[live-auction] unexpected error:', err);
        setError('Failed to load live auctions.');
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [isHydrated, initialVehicleId]);

  const filteredAuctions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return auctions;

    return auctions.filter((a) => {
      const v = a.vehicle;
      const combined = `${v.year} ${v.make} ${v.model} ${v.bodyType} ${v.fuelType} ${
        v.location ?? ''
      }`;
      return combined.toLowerCase().includes(q);
    });
  }, [auctions, search]);

  const selectedAuction =
    filteredAuctions.find((a) => a.id === selectedId) ||
    auctions.find((a) => a.id === selectedId) ||
    filteredAuctions[0] ||
    auctions[0] ||
    null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatShortTime = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return 'Ending now';

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h left`;
    if (hours > 0) return `${hours}h ${minutes % 60}m left`;
    return `${minutes}m left`;
  };

  if (!isHydrated || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search / summary */}
        <section className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-card-foreground">
                Live Auctions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Click any vehicle to open the live bidding view.
              </p>
            </div>

            <div className="w-full md:w-80">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon name="MagnifyingGlassIcon" size={18} />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by make, model, fuel, location..."
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs md:text-sm text-muted-foreground">
            <span>
              Total live auctions:{' '}
              <span className="font-semibold text-card-foreground">
                {auctions.length}
              </span>
            </span>
            <span>
              Showing:{' '}
              <span className="font-semibold text-card-foreground">
                {filteredAuctions.length}
              </span>
            </span>
          </div>

          {error && (
            <p className="mt-3 text-sm text-error flex items-center gap-2">
              <Icon name="ExclamationTriangleIcon" size={16} />
              {error}
            </p>
          )}
        </section>

        {/* Auctions grid */}
        <section>
          {filteredAuctions.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-10 text-center">
              <p className="text-muted-foreground mb-2">
                No live auctions found right now.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check back later or adjust your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAuctions.map((auction) => {
                const isSelected = selectedAuction?.id === auction.id;
                const v = auction.vehicle;

                return (
                  <button
                    key={auction.id}
                    type="button"
                    onClick={() => setSelectedId(auction.id)}
                    className={`text-left rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring ${
                      isSelected
                        ? 'border-primary/70 ring-1 ring-primary/40'
                        : 'border-border'
                    }`}
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      {v.image ? (
                        <img
                          src={v.image}
                          alt={v.alt}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="absolute left-3 top-3 flex items-center space-x-1 rounded-full bg-emerald-500 text-xs font-medium text-white px-2 py-0.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>Live Auction</span>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {v.year} • {v.bodyType}
                        </p>
                        <h3 className="text-sm font-semibold text-card-foreground line-clamp-2">
                          {v.make} {v.model}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {v.mileage.toLocaleString('en-GB')} miles •{' '}
                          {v.fuelType}
                        </span>
                        <span>•</span>
                        <span>{v.transmission}</span>
                        {v.location && (
                          <>
                            <span>•</span>
                            <span>{v.location}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-[11px] text-muted-foreground">
                            Current Bid
                          </p>
                          <p className="text-sm font-semibold text-card-foreground">
                            {formatCurrency(
                              auction.currentBid || auction.startingPrice,
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-muted-foreground">
                            Time remaining
                          </p>
                          <p className="text-xs font-medium">
                            {formatShortTime(auction.endTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected auction full bid preview */}
        {selectedAuction && (
          <section className="mt-10 space-y-6">
            <AuctionHeader
              vehicle={selectedAuction.vehicle}
              auctionStatus="live"
            />
            <LiveAuctionInteractive
              vehicle={selectedAuction.vehicle}
              auctionId={selectedAuction.id}
              startingPrice={selectedAuction.startingPrice}
              reservePrice={selectedAuction.reservePrice}
              bidIncrement={selectedAuction.bidIncrement}
              endTime={selectedAuction.endTime}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default LiveAuctionsBrowser;
