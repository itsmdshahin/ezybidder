import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface SavedVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  previousPrice?: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  image: string;
  alt: string;
  location: string;
  savedDate: string;
  priceChange?: 'increased' | 'decreased' | 'same';
}

interface SavedVehiclesProps {
  vehicles: SavedVehicle[];
}

const SavedVehicles = ({ vehicles }: SavedVehiclesProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-GB').format(mileage);
  };

  const getPriceChangeIcon = (change?: string) => {
    switch (change) {
      case 'increased':
        return { icon: 'ArrowTrendingUpIcon', color: 'text-error' };
      case 'decreased':
        return { icon: 'ArrowTrendingDownIcon', color: 'text-success' };
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Saved Vehicles</h3>
          <Link
            href="/saved-vehicles"
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View All ({vehicles.length})
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.slice(0, 4).map((vehicle) => {
              const priceChange = getPriceChangeIcon(vehicle.priceChange);
              
              return (
                <Link
                  key={vehicle.id}
                  href={`/vehicle-details/${vehicle.id}`}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 group"
                >
                  <div className="relative">
                    <AppImage
                      src={vehicle.image}
                      alt={vehicle.alt}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <button className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background transition-colors duration-200">
                      <Icon name="HeartIcon" size={16} className="text-error fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors duration-200">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-semibold text-card-foreground">
                          {formatPrice(vehicle.price)}
                        </span>
                        {priceChange && (
                          <Icon name={priceChange.icon} size={16} className={priceChange.color} />
                        )}
                      </div>
                      
                      {vehicle.previousPrice && vehicle.priceChange !== 'same' && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(vehicle.previousPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{formatMileage(vehicle.mileage)} miles</span>
                      <span>{vehicle.fuelType}</span>
                      <span>{vehicle.transmission}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPinIcon" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{vehicle.location}</span>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        Saved {new Date(vehicle.savedDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="HeartIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No saved vehicles yet</p>
            <Link
              href="/vehicle-marketplace"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              <Icon name="MagnifyingGlassIcon" size={16} />
              <span>Browse Vehicles</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVehicles;