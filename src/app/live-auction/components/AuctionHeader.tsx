import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface AuctionHeaderProps {
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    image: string;
    alt: string;
    mileage: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
  };
  auctionStatus: 'live' | 'ending-soon' | 'ended';
}

const AuctionHeader = ({ vehicle, auctionStatus }: AuctionHeaderProps) => {
  const getStatusColor = () => {
    switch (auctionStatus) {
      case 'live':
        return 'bg-success text-success-foreground';
      case 'ending-soon':
        return 'bg-warning text-warning-foreground';
      case 'ended':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (auctionStatus) {
      case 'live':
        return 'Live Auction';
      case 'ending-soon':
        return 'Ending Soon';
      case 'ended':
        return 'Auction Ended';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vehicle Image */}
        <div className="lg:w-1/3">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <AppImage
              src={vehicle.image}
              alt={vehicle.alt}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="lg:w-2/3">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPinIcon" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mileage</p>
                    <p className="text-sm font-medium text-card-foreground">{vehicle.mileage.toLocaleString()} miles</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="BeakerIcon" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="text-sm font-medium text-card-foreground">{vehicle.fuelType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="CogIcon" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p className="text-sm font-medium text-card-foreground">{vehicle.transmission}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="TruckIcon" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Body Type</p>
                    <p className="text-sm font-medium text-card-foreground">{vehicle.bodyType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionHeader;