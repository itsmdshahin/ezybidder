// src/app/live-auction/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import AuctionHeader from '../components/AuctionHeader';
import LiveAuctionInteractive from '../components/LiveAuctionInteractive';
import { supabase } from '@/lib/supabaseClient';

type AuctionStatusLabel = 'live' | 'upcoming' | 'ended';

interface VehicleRow {
  id: string;
  title: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  fuel_type: string | null;
  body_type: string | null;
  transmission: string | null;
  images: string[] | null;
  location: string | null;
}

interface AuctionRow {
  id: string;
  vehicle_id: string;
  seller_id: string;
  starting_price: number;
  reserve_price: number | null;
  current_bid: number | null;
  bid_increment: number | null;
  start_time: string;
  end_time: string;
  status: string;
  total_bids: number | null;
  watchers: number | null;
  vehicles: VehicleRow | null;
}

// --- Helper to fetch auction + vehicle on server ---
async function getAuctionWithVehicle(auctionId: string): Promise<{
  auction: AuctionRow;
  statusLabel: AuctionStatusLabel;
}> {
  const { data, error } = await supabase
    .from('auctions')
    .select(
      `
      id,
      vehicle_id,
      seller_id,
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
    `
    )
    .eq('id', auctionId)
    .single();

  if (error || !data) {
    console.error('[live-auction/[id]] fetch error:', error);
    notFound();
  }

  const auction = data as AuctionRow;

  // Derive a simple status label for header
  const now = Date.now();
  const start = new Date(auction.start_time).getTime();
  const end = new Date(auction.end_time).getTime();

  let statusLabel: AuctionStatusLabel = 'upcoming';

  if (auction.status === 'ended' || now >= end) {
    statusLabel = 'ended';
  } else if (auction.status === 'active' && now >= start && now < end) {
    statusLabel = 'live';
  } else {
    statusLabel = 'upcoming';
  }

  return { auction, statusLabel };
}

// --- Dynamic metadata ---
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { auction } = await getAuctionWithVehicle(params.id);
  const v = auction.vehicles;

  const title =
    v?.title ||
    `${v?.year ?? ''} ${v?.make ?? ''} ${v?.model ?? ''}`.trim() ||
    'Live Auction Vehicle';

  return {
    title: `${title} – Live Auction`,
    description:
      'View full details and bid live on this vehicle in the EzyBidder auction marketplace.',
  };
}

export default async function LiveAuctionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const auctionId = params.id;

  const { auction, statusLabel } = await getAuctionWithVehicle(auctionId);
  const v = auction.vehicles;

  if (!v) {
    notFound();
  }

  // Map DB vehicle row → UI vehicle props
  const imagesArray = Array.isArray(v.images) ? v.images : [];
  const primaryImage = imagesArray[0] ?? '';

  const uiVehicle = {
    id: v.id,
    make: v.make ?? 'Unknown',
    model: v.model ?? '',
    year: v.year ?? 0,
    image: primaryImage,
    alt:
      v.title ||
      `${v.year ?? ''} ${v.make ?? ''} ${v.model ?? ''}`.trim() ||
      'Auction vehicle',
    mileage: v.mileage ?? 0,
    fuelType: (v.fuel_type ?? '').toString().toLowerCase() || 'petrol',
    transmission: v.transmission ?? 'automatic',
    bodyType: v.body_type ?? 'Hatchback',
    location: v.location ?? null,
  };

  const startingPrice = Number(auction.starting_price ?? 0);
  const reservePrice =
    auction.reserve_price !== null ? Number(auction.reserve_price) : null;
  const bidIncrement = Number(auction.bid_increment ?? 50);
  const endTime = auction.end_time;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadcrumbNavigation />
          </div>
        </div>

        {/* Page header / hero */}
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AuctionHeader vehicle={uiVehicle} auctionStatus={statusLabel} />
          </div>
        </div>

        {/* Main auction content */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LiveAuctionInteractive
              vehicle={uiVehicle}
              auctionId={auction.id}
              startingPrice={startingPrice}
              reservePrice={reservePrice}
              bidIncrement={bidIncrement}
              endTime={endTime}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
