// src/app/live-auction/page.tsx
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import LiveAuctionsBrowser from './components/LiveAuctionsBrowser';

export const metadata: Metadata = {
  title: 'Live Auctions - EzyBidder',
  description:
    'Bid in real-time on verified vehicles. View live auctions, track bids, and participate with secure bidding and proxy options.',
};

export default function LiveAuctionPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const vehicleIdParam = searchParams?.vehicleId;
  const initialVehicleId = Array.isArray(vehicleIdParam)
    ? vehicleIdParam[0]
    : vehicleIdParam;

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

        {/* Page Header */}
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Live Vehicle Auctions
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse all vehicles currently being auctioned. Filter, search,
                and jump straight into the live bidding screen for each car.
              </p>
            </div>
          </div>
        </div>

        {/* Live auctions grid + bid preview */}
        <LiveAuctionsBrowser initialVehicleId={initialVehicleId} />
      </main>
    </div>
  );
}
