'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BiddingInterfaceProps {
  currentBid: number;
  minimumIncrement: number;
  isAuctionActive: boolean;
  onPlaceBid: (amount: number) => void;
  onSetProxyBid: (maxAmount: number) => void;
}

const BiddingInterface = ({ 
  currentBid, 
  minimumIncrement, 
  isAuctionActive, 
  onPlaceBid, 
  onSetProxyBid 
}: BiddingInterfaceProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [bidAmount, setBidAmount] = useState(currentBid + minimumIncrement);
  const [proxyMaxBid, setProxyMaxBid] = useState(0);
  const [showProxyBidding, setShowProxyBidding] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isSettingProxy, setIsSettingProxy] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      setBidAmount(currentBid + minimumIncrement);
    }
  }, [currentBid, minimumIncrement, isHydrated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlaceBid = async () => {
    if (!isAuctionActive || bidAmount < currentBid + minimumIncrement) return;
    
    setIsPlacingBid(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onPlaceBid(bidAmount);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleSetProxyBid = async () => {
    if (!isAuctionActive || proxyMaxBid <= currentBid) return;
    
    setIsSettingProxy(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSetProxyBid(proxyMaxBid);
      setShowProxyBidding(false);
    } finally {
      setIsSettingProxy(false);
    }
  };

  const quickBidAmounts = [
    currentBid + minimumIncrement,
    currentBid + (minimumIncrement * 2),
    currentBid + (minimumIncrement * 5),
    currentBid + (minimumIncrement * 10)
  ];

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Place Your Bid</h3>
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded mb-4"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuctionActive) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <Icon name="ClockIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Auction Ended</h3>
          <p className="text-muted-foreground">Bidding is no longer available for this auction.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Place Your Bid</h3>
        <button
          onClick={() => setShowProxyBidding(!showProxyBidding)}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          {showProxyBidding ? 'Manual Bidding' : 'Proxy Bidding'}
        </button>
      </div>

      {!showProxyBidding ? (
        <div className="space-y-4">
          {/* Manual Bidding */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Bid Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={currentBid + minimumIncrement}
                step={minimumIncrement}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum bid: {formatCurrency(currentBid + minimumIncrement)}
            </p>
          </div>

          {/* Quick Bid Buttons */}
          <div>
            <p className="text-sm font-medium text-card-foreground mb-2">Quick Bid</p>
            <div className="grid grid-cols-2 gap-2">
              {quickBidAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBidAmount(amount)}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors duration-200"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceBid}
            disabled={isPlacingBid || bidAmount < currentBid + minimumIncrement}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isPlacingBid ? (
              <>
                <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                <span>Placing Bid...</span>
              </>
            ) : (
              <>
                <Icon name="CurrencyPoundIcon" size={20} />
                <span>Place Bid - {formatCurrency(bidAmount)}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Proxy Bidding */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2 mb-3">
              <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-card-foreground">Proxy Bidding</h4>
                <p className="text-sm text-muted-foreground">
                  Set your maximum bid and we'll automatically bid for you up to that amount.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Maximum Bid Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
              <input
                type="number"
                value={proxyMaxBid}
                onChange={(e) => setProxyMaxBid(Number(e.target.value))}
                min={currentBid + minimumIncrement}
                step={minimumIncrement}
                className="w-full pl-8 pr-4 py-3 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter your maximum bid"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Must be higher than current bid: {formatCurrency(currentBid)}
            </p>
          </div>

          <button
            onClick={handleSetProxyBid}
            disabled={isSettingProxy || proxyMaxBid <= currentBid}
            className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-md font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isSettingProxy ? (
              <>
                <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                <span>Setting Proxy Bid...</span>
              </>
            ) : (
              <>
                <Icon name="ShieldCheckIcon" size={20} />
                <span>Set Proxy Bid</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BiddingInterface;