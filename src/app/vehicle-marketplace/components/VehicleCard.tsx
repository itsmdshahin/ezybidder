// src/app/vehicle-marketplace/components/VehicleCard.tsx
'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import React from 'react';

interface VehicleImage {
  url: string;
  alt?: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string;
  bodyType: string;
  transmission: string;
  engineSize: string;
  images: VehicleImage[];
  motStatus: 'valid' | 'expired' | 'due-soon';
  motExpiryDate?: string;
  sellerType: 'private' | 'dealer' | 'showroom';
  sellerRating: number;
  listingType: 'fixed-price' | 'auction' | 'both';
  dvlaVerified: boolean;
  priceScore: 'excellent' | 'good' | 'fair' | 'high';
  location: string;
  isWishlisted: boolean;
  auctionEndTime?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistToggle: (vehicleId: string) => void;
  onCompareToggle: (vehicleId: string) => void;
  isSelected: boolean;
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x480?text=No+Image';

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onWishlistToggle,
  onCompareToggle,
  isSelected,
}) => {
  const formatPrice = (price: number) => {
    const p = Number(price) || 0;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p);
  };

  const formatMileage = (mileage: number) => {
    const m = Number(mileage) || 0;
    return new Intl.NumberFormat('en-GB').format(m);
  };

  const getPriceScoreColor = (score: string) => {
    switch (score) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'fair':
        return 'text-warning bg-warning/10';
      case 'high':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getMOTStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-success bg-success/10';
      case 'due-soon':
        return 'text-warning bg-warning/10';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  // safe image source
  const firstImage =
    vehicle.images && vehicle.images.length > 0 && vehicle.images[0]?.url
      ? vehicle.images[0]
      : { url: PLACEHOLDER_IMAGE, alt: `${vehicle.make} ${vehicle.model}` };

  // listing type tolerant check (accept 'both' too)
  const isAuction = (vehicle.listingType ?? '')
    .toString()
    .toLowerCase()
    .includes('auction');

  // ✅ decide where "View Details" goes
  const detailsHref = isAuction
    ? `/live-auction?vehicleId=${encodeURIComponent(vehicle.id)}`
    : `/vehicle-details?id=${encodeURIComponent(vehicle.id)}`;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <AppImage
          src={firstImage.url}
          alt={firstImage.alt ?? `${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => onWishlistToggle(vehicle.id)}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors duration-200"
            aria-label="Toggle wishlist"
          >
            <Icon
              name="HeartIcon"
              size={20}
              variant={vehicle.isWishlisted ? 'solid' : 'outline'}
              className={
                vehicle.isWishlisted ? 'text-error' : 'text-muted-foreground'
              }
            />
          </button>

          <button
            onClick={() => onCompareToggle(vehicle.id)}
            className={`p-2 backdrop-blur-sm rounded-full transition-colors duration-200 ${
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-muted-foreground hover:bg-background'
            }`}
            aria-pressed={isSelected}
            aria-label="Toggle compare"
          >
            <Icon name="ScaleIcon" size={20} />
          </button>
        </div>

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3">
          {isAuction ? (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-md">
              AUCTION
            </span>
          ) : (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
              FIXED PRICE
            </span>
          )}
        </div>

        {/* Auction Timer */}
        {isAuction && vehicle.auctionEndTime && (
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <div className="flex items-center space-x-1 text-xs">
              <Icon name="ClockIcon" size={14} className="text-error" />
              {/* Placeholder — you can replace with a live countdown */}
              <span className="text-foreground font-medium">2h 45m left</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Vehicle Title */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-muted-foreground">{vehicle.location}</p>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center space-x-1">
            <Icon name="MapPinIcon" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatMileage(vehicle.mileage)} miles
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CogIcon" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="BoltIcon" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon
              name="WrenchScrewdriverIcon"
              size={14}
              className="text-muted-foreground"
            />
            <span className="text-muted-foreground">
              {vehicle.engineSize || '-'}
            </span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center space-x-2 mb-3">
          {vehicle.dvlaVerified && (
            <div className="flex items-center space-x-1">
              <Icon name="CheckBadgeIcon" size={16} className="text-success" />
              <span className="text-xs text-success font-medium">
                DVLA Verified
              </span>
            </div>
          )}
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium ${getMOTStatusColor(
              vehicle.motStatus
            )}`}
          >
            MOT{' '}
            {vehicle.motStatus === 'valid'
              ? 'Valid'
              : vehicle.motStatus === 'due-soon'
              ? 'Due Soon'
              : 'Expired'}
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground capitalize">
              {vehicle.sellerType}
            </span>
            {vehicle.sellerType !== 'private' && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={12}
                    variant={
                      i < Math.floor(vehicle.sellerRating) ? 'solid' : 'outline'
                    }
                    className={
                      i < Math.floor(vehicle.sellerRating)
                        ? 'text-warning'
                        : 'text-muted-foreground'
                    }
                  />
                ))}
                <span className="text-xs text-muted-foreground">
                  ({vehicle.sellerRating?.toFixed(1) ?? 0})
                </span>
              </div>
            )}
          </div>
          <div
            className={`px-2 py-1 rounded-md text-xs font-medium ${getPriceScoreColor(
              vehicle.priceScore
            )}`}
          >
            {vehicle.priceScore?.toUpperCase?.() ?? 'GOOD'} VALUE
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-card-foreground">
              {formatPrice(vehicle.price)}
            </p>
            {isAuction && (
              <p className="text-xs text-muted-foreground">Current bid</p>
            )}
          </div>

          {/* ✅ Now dynamic route based on listing type */}
          <Link
            href={detailsHref}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
