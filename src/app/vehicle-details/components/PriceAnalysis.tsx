import Icon from '@/components/ui/AppIcon';

interface PriceAnalysisProps {
  currentPrice: number;
  marketAverage: number;
  priceScore: number;
  priceHistory: PricePoint[];
  similarVehicles: SimilarVehicle[];
}

interface PricePoint {
  date: string;
  price: number;
}

interface SimilarVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  location: string;
}

const PriceAnalysis = ({ currentPrice, marketAverage, priceScore, priceHistory, similarVehicles }: PriceAnalysisProps) => {
  const priceDifference = currentPrice - marketAverage;
  const percentageDifference = ((priceDifference / marketAverage) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Value';
    if (score >= 60) return 'Good Value';
    return 'Above Market';
  };

  return (
    <div className="space-y-6">
      {/* AI Price Score */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">AI Price Analysis</h3>
          <div className="flex items-center space-x-2">
            <Icon name="SparklesIcon" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">Powered by AI</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(priceScore)}`}>
            {priceScore}/100
          </div>
          <p className={`text-lg font-medium ${getScoreColor(priceScore)}`}>
            {getScoreLabel(priceScore)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">£{currentPrice.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Current Price</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">£{marketAverage.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Market Average</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className={`text-2xl font-bold ${priceDifference < 0 ? 'text-success' : 'text-error'}`}>
              {priceDifference < 0 ? '-' : '+'}£{Math.abs(priceDifference).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {percentageDifference < 0 ? '' : '+'}{percentageDifference.toFixed(1)}% vs Market
            </p>
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Similar Vehicles</h3>
        <div className="space-y-3">
          {similarVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors duration-200">
              <div>
                <h4 className="font-medium text-card-foreground">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {vehicle.mileage.toLocaleString()} miles • {vehicle.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-card-foreground">£{vehicle.price.toLocaleString()}</p>
                <p className={`text-sm ${
                  vehicle.price < currentPrice ? 'text-success' : 'text-error'
                }`}>
                  {vehicle.price < currentPrice ? '-' : '+'}£{Math.abs(vehicle.price - currentPrice).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price History Chart Placeholder */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Price History</h3>
        <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Icon name="ChartBarIcon" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Price trend chart would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;