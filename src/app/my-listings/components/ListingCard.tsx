'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

type AuctionRow = any;

interface Props {
  listing: AuctionRow;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ListingCard({ listing, onEdit, onDelete }: Props) {
  const vehicle = listing.vehicles ?? {};
  const img =
    Array.isArray(vehicle.images) && vehicle.images.length ? vehicle.images[0] : null;
  const price = listing.starting_price ?? vehicle.price ?? 0;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-48">
        <AppImage
          src={img ?? '/images/placeholder-car.png'}
          alt={`${vehicle.make ?? ''} ${vehicle.model ?? ''}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md">
            {listing.status?.toUpperCase() ?? 'DRAFT'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {vehicle.year ?? ''} {vehicle.make ?? ''} {vehicle.model ?? ''}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.vrm ?? vehicle.location ?? ''}
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">£{Number(price).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {listing.total_bids ?? 0} bids
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {vehicle.description ?? ''}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={onEdit} className="px-3 py-2 bg-secondary rounded-md text-sm">
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-error/10 text-error rounded-md text-sm"
            >
              Delete
            </button>
            {vehicle.id && (
              <Link
                href={`/vehicle-details?id=${vehicle.id}`}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                View
              </Link>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <div>
              Ends:{' '}
              {listing.end_time ? new Date(listing.end_time).toLocaleString() : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
