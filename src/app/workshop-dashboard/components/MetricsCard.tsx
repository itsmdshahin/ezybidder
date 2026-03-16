import Icon from '@/components/ui/AppIcon';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  period: string;
}

const MetricsCard = ({ title, value, change, changeType, icon, period }: MetricsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return 'ArrowTrendingUpIcon';
      case 'decrease':
        return 'ArrowTrendingDownIcon';
      default:
        return 'MinusIcon';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{period}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;