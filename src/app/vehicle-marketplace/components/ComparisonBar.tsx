'use client';

import Icon from '@/components/ui/AppIcon';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

interface ComparisonBarProps {
  selectedVehicles: Vehicle[];
  onRemoveVehicle: (vehicleId: string) => void;
  onCompareVehicles: () => void;
  onClearAll: () => void;
}

const ComparisonBar = ({ 
  selectedVehicles, 
  onRemoveVehicle, 
  onCompareVehicles, 
  onClearAll 
}: ComparisonBarProps) => {
  if (selectedVehicles.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Selected Vehicles */}
          <div className="flex items-center space-x-4 flex-1 overflow-x-auto">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Icon name="ScaleIcon" size={20} className="text-primary" />
              <span className="text-sm font-medium text-card-foreground">
                Compare ({selectedVehicles.length}/3)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {selectedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center space-x-2 bg-muted rounded-lg p-2 min-w-0"
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={vehicle.images[0]?.url}
                      alt={vehicle.images[0]?.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(vehicle.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="p-1 hover:bg-background rounded-full transition-colors duration-200 flex-shrink-0"
                  >
                    <Icon name="XMarkIcon" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              onClick={onCompareVehicles}
              disabled={selectedVehicles.length < 2}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;