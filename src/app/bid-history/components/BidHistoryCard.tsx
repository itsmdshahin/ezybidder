'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function BidHistoryCard({ bid }: any) {
  const auction = bid.auctions;
  const vehicle = auction?.vehicles;

  const img = Array.isArray(vehicle?.images) && vehicle.images.length
    ? vehicle.images[0]
    : '/images/placeholder-car.png';

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative h-48">
        <AppImage
          src={img}
          alt={`${vehicle?.make} ${vehicle?.model}`}
          className="w-full h-full object-cover"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {bid.is_winning ? (
            <span className="px-2 py-1 bg-success text-success-foreground text-xs rounded-md">
              Leading
            </span>
          ) : (
            <span className="px-2 py-1 bg-error text-error-foreground text-xs rounded-md">
              Outbid
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {vehicle?.year} {vehicle?.make} {vehicle?.model}
        </h3>
        <p className="text-sm text-muted-foreground">{vehicle?.vrm}</p>

        {/* Bid Information */}
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Your Bid:</span>
            <span className="font-medium">£{bid.amount}</span>
          </div>

          {bid.max_bid > bid.amount && (
            <div className="flex justify-between text-muted-foreground">
              <span>Max Auto Bid:</span>
              <span>£{bid.max_bid}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Auction Status:</span>
            <span className="font-medium">{auction?.status}</span>
          </div>

          <div className="flex justify-between">
            <span>Bid Time:</span>
            <span>{new Date(bid.bid_time).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/vehicle-details?id=${vehicle?.id}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            View Vehicle
          </Link>

          <Link
            href={`/auction-details?id=${auction?.id}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            Auction
          </Link>
        </div>
      </div>
    </div>
  );
}
