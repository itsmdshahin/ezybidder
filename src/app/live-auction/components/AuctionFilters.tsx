"use client";

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Filters {
  endingSoon?: boolean;
  reserveMet?: boolean;
  buyNow?: boolean;
  minBid?: number;
  maxBid?: number;
}

interface AuctionFiltersProps {
  onChange?: (filters: Filters) => void;
}

export default function AuctionFilters({ onChange }: AuctionFiltersProps) {
  const [endingSoon, setEndingSoon] = useState(false);
  const [reserveMet, setReserveMet] = useState(false);
  const [buyNow, setBuyNow] = useState(false);
  const [minBid, setMinBid] = useState(0);
  const [maxBid, setMaxBid] = useState(100000);

  useEffect(() => {
    onChange?.({ endingSoon, reserveMet, buyNow, minBid, maxBid });
  }, [endingSoon, reserveMet, buyNow, minBid, maxBid]);

  const clearAll = () => {
    setEndingSoon(false);
    setReserveMet(false);
    setBuyNow(false);
    setMinBid(0);
    setMaxBid(100000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-card-foreground text-sm">Filters</h4>
          <button className="text-xs text-muted-foreground" onClick={clearAll}>Reset</button>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={endingSoon} onChange={(e) => setEndingSoon(e.target.checked)} />
            <span>Ending within 24 hours</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={reserveMet} onChange={(e) => setReserveMet(e.target.checked)} />
            <span>Reserve met</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" checked={buyNow} onChange={(e) => setBuyNow(e.target.checked)} />
            <span>Buy it now</span>
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-card-foreground text-sm mb-2">Current Bid Range</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <input type="number" className="input w-1/2" value={minBid} onChange={(e) => setMinBid(Number(e.target.value))} />
            <input type="number" className="input w-1/2" value={maxBid} onChange={(e) => setMaxBid(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-card-foreground text-sm mb-2">Vehicle Type</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Premium/Luxury</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Classic</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Sports</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Electric/Hybrid</span></label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-card-foreground text-sm mb-2">Bid Activity</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>High activity (10+ bids)</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>New listings (24h)</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Highly watched (20+)</span></label>
        </div>
      </div>
    </div>
  );
}
