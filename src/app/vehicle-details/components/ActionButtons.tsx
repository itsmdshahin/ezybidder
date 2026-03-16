'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActionButtonsProps {
  vehicleId: string;   // ✅ uuid, not number
  price: number;
  isAuction: boolean;
  currentBid?: number;
  timeRemaining?: string;
  onAddToWishlist: () => void;
  onCompare: () => void;
  onFinanceCalculator: () => void;
  onPlaceBid?: (amount: number) => void;
  onBuyNow?: () => void;
}

const ActionButtons = ({
  vehicleId,
  price,
  isAuction,
  currentBid,
  timeRemaining,
  onAddToWishlist,
  onCompare,
  onFinanceCalculator,
  onPlaceBid,
  onBuyNow,
}: ActionButtonsProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [bidAmount, setBidAmount] = useState(
    currentBid ? currentBid + 50 : price
  );
  const [showBidModal, setShowBidModal] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist();
  };

  const handlePlaceBid = () => {
    if (onPlaceBid && bidAmount > (currentBid || 0)) {
      onPlaceBid(bidAmount);
      setShowBidModal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="bg-card rounded-lg border border-border p-6">
        {isAuction ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Current Bid
              </span>
              <span className="text-sm text-error font-medium">
                {timeRemaining}
              </span>
            </div>
            <p className="text-3xl font-bold text-card-foreground mb-1">
              £{(currentBid || price).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Reserve:{' '}
              {currentBid && currentBid >= price ? 'Met' : 'Not Met'}
            </p>
          </div>
        ) : (
          <div>
            <span className="text-sm text-muted-foreground">Price</span>
            <p className="text-3xl font-bold text-card-foreground">
              £{price.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAuction ? (
          <button
            onClick={() => setShowBidModal(true)}
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="CursorArrowRaysIcon" size={24} />
            <span>Place Bid</span>
          </button>
        ) : (
          <button
            onClick={onBuyNow}
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="ShoppingCartIcon" size={24} />
            <span>Buy Now</span>
          </button>
        )}

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleWishlist}
            className={`py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
              isWishlisted
                ? 'bg-error text-error-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
            }`}
          >
            <Icon
              name="HeartIcon"
              size={20}
              variant={isWishlisted ? 'solid' : 'outline'}
            />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={onCompare}
            className="bg-secondary text-secondary-foreground py-3 px-4 rounded-md font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowsRightLeftIcon" size={20} />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            onClick={onFinanceCalculator}
            className="bg-secondary text-secondary-foreground py-3 px-4 rounded-md font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="CalculatorIcon" size={20} />
            <span className="hidden sm:inline">Finance</span>
          </button>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Place Your Bid
              </h3>
              <button
                onClick={() => setShowBidModal(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors duration-200"
              >
                <Icon
                  name="XMarkIcon"
                  size={20}
                  className="text-muted-foreground"
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Bid Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    £
                  </span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) =>
                      setBidAmount(Number(e.target.value))
                    }
                    className="w-full pl-8 pr-4 py-3 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    min={(currentBid || 0) + 1}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum bid: £
                  {((currentBid || 0) + 1).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 px-4 rounded-md font-medium hover:bg-secondary/90 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceBid}
                  disabled={bidAmount <= (currentBid || 0)}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Place Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon
              name="ShieldCheckIcon"
              size={16}
              className="text-success"
            />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="TruckIcon" size={16} className="text-primary" />
            <span>Protected Delivery</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon
              name="ArrowPathIcon"
              size={16}
              className="text-warning"
            />
            <span>Money Back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
