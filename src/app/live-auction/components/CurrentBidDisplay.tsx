import Icon from '@/components/ui/AppIcon';

interface CurrentBidDisplayProps {
  currentBid: number;
  minimumIncrement: number;
  reserveMet: boolean;
  totalBids: number;
}

const CurrentBidDisplay = ({ currentBid, minimumIncrement, reserveMet, totalBids }: CurrentBidDisplayProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="CurrencyPoundIcon" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Current Bid</h3>
        </div>
        
        <div className="text-4xl lg:text-5xl font-bold text-primary mb-4">
          {formatCurrency(currentBid)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Next Minimum Bid</p>
            <p className="text-lg font-semibold text-card-foreground">
              {formatCurrency(currentBid + minimumIncrement)}
            </p>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Bids</p>
            <p className="text-lg font-semibold text-card-foreground">{totalBids}</p>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={reserveMet ? "CheckCircleIcon" : "XCircleIcon"} 
                size={16} 
                className={reserveMet ? "text-success" : "text-error"} 
              />
              <p className="text-sm text-muted-foreground">Reserve</p>
            </div>
            <p className={`text-lg font-semibold ${reserveMet ? 'text-success' : 'text-error'}`}>
              {reserveMet ? 'Met' : 'Not Met'}
            </p>
          </div>
        </div>

        {!reserveMet && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning font-medium">
              <Icon name="InformationCircleIcon" size={16} className="inline mr-2" />
              Reserve price has not been met. Seller may choose not to complete the sale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBidDisplay;