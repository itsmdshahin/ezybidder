'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface BidHistoryItem {
  id: string;
  bidder: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
  isProxy: boolean;
}

interface BidHistoryProps {
  bids: BidHistoryItem[];
}

const BidHistory = ({ bids }: BidHistoryProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    if (!isHydrated) return 'Loading...';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    if (!isHydrated) return 'Loading...';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Bid History</h3>
        <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted"></div>
                  <div className="space-y-1">
                    <div className="w-28 h-3 bg-muted rounded" />
                    <div className="w-16 h-3 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-20 h-3 bg-muted rounded" />
              </div>
            ))}
          </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Bid History</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="ClockIcon" size={16} />
          <span>{bids.length} bids</span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {bids.length > 0 ? (
          <div className="space-y-2">
            {bids.map((bid, index) => (
              <div key={bid.id} className={`flex items-center justify-between p-3 rounded-lg border ${bid.isWinning ? 'border-green-200 bg-green-50' : 'border-neutral-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {/* This can be replaced with AppImage for avatars */}
                    <div className="bg-muted w-full h-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-card-foreground">{bid.bidder}</span>
                      {bid.isProxy && (
                        <div className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-secondary/10 text-secondary">
                          <Icon name="ShieldCheckIcon" size={12} />
                          <span>Proxy</span>
                        </div>
                      )}
                      {bid.isWinning && (
                        <div className="flex items-center space-x-1 bg-success px-2 py-0.5 rounded text-xs text-white">
                          <Icon name="LightningBoltIcon" size={12} />
                          <span>Winning</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="ClockIcon" size={12} className="text-muted-foreground" />
                      <span>{formatTime(bid.timestamp)} • {formatDate(bid.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${bid.isWinning ? 'text-success' : 'text-card-foreground'}`}>{formatCurrency(bid.amount)}</div>
                  {bid.isWinning && <div className="text-xs text-success">Current high bid</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="ClockIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bids placed yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to place a bid!</p>
          </div>
        )}
      </div>

      {bids.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Highest bid: {formatCurrency(Math.max(...bids.map(b => b.amount)))}
            </span>
            <span className="text-muted-foreground">
              Last updated: {formatTime(bids[0]?.timestamp || new Date().toISOString())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidHistory;