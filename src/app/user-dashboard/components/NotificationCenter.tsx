'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Notification {
  id: string;
  type: 'auction' | 'message' | 'payment' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications }: NotificationCenterProps) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'auction':
        return 'FireIcon';
      case 'message':
        return 'ChatBubbleLeftIcon';
      case 'payment':
        return 'CreditCardIcon';
      case 'booking':
        return 'CalendarIcon';
      case 'system':
        return 'CogIcon';
      default:
        return 'BellIcon';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10';
      case 'medium':
        return 'text-warning bg-warning/10';
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

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || (filter === 'unread' && !notification.read)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
            <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
              Mark all read
            </button>
          </div>
        </div>
        
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === 'all' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === 'unread' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 hover:bg-muted/50 transition-colors duration-200 ${
                !notification.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                  <Icon name={getNotificationIcon(notification.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${!notification.read ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    
                    {notification.actionUrl && (
                      <button className="text-xs text-primary hover:text-primary/80 transition-colors duration-200">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Icon name="BellIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;