import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'bid' | 'message' | 'listing' | 'payment' | 'booking';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning' | 'error';
  amount?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid':
        return 'CurrencyPoundIcon';
      case 'message':
        return 'ChatBubbleLeftIcon';
      case 'listing':
        return 'RectangleStackIcon';
      case 'payment':
        return 'CreditCardIcon';
      case 'booking':
        return 'CalendarIcon';
      default:
        return 'BellIcon';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                  <Icon name={getActivityIcon(activity.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-card-foreground">{activity.title}</h4>
                    {activity.amount && (
                      <span className="text-sm font-medium text-success">{activity.amount}</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Icon name="ClockIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;