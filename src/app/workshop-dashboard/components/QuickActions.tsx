'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

interface NotificationItem {
  id: string;
  type: 'approval' | 'message' | 'alert' | 'reminder';
  title: string;
  message: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

interface QuickActionsProps {
  className?: string;
}

const QuickActions = ({ className = '' }: QuickActionsProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'approval',
      title: 'Estimate Approval Required',
      message: 'BMW X5 dent repair estimate needs approval - £450',
      time: '5 minutes ago',
      priority: 'high',
      read: false
    },
    {
      id: '2',
      type: 'message',
      title: 'New Customer Message',
      message: 'Sarah Wilson: "When will my car be ready?"',
      time: '15 minutes ago',
      priority: 'medium',
      read: false
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Service Reminder Due',
      message: '3 customers due for service reminders today',
      time: '1 hour ago',
      priority: 'low',
      read: true
    },
    {
      id: '4',
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Brake pads running low - 2 sets remaining',
      time: '2 hours ago',
      priority: 'medium',
      read: false
    }
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'New Booking',
      description: 'Schedule a new service appointment',
      icon: 'CalendarPlusIcon',
      color: 'bg-primary text-primary-foreground',
      action: () => console.log('New booking')
    },
    {
      id: '2',
      title: 'Quick Estimate',
      description: 'Generate service estimate',
      icon: 'CalculatorIcon',
      color: 'bg-success text-success-foreground',
      action: () => console.log('Quick estimate')
    },
    {
      id: '3',
      title: 'Customer Message',
      description: 'Send message to customer',
      icon: 'ChatBubbleLeftEllipsisIcon',
      color: 'bg-warning text-warning-foreground',
      action: () => console.log('Customer message')
    },
    {
      id: '4',
      title: 'Add Customer',
      description: 'Register new customer',
      icon: 'UserPlusIcon',
      color: 'bg-accent text-accent-foreground',
      action: () => console.log('Add customer')
    },
    {
      id: '5',
      title: 'Inventory Check',
      description: 'Check parts inventory',
      icon: 'ClipboardDocumentListIcon',
      color: 'bg-secondary text-secondary-foreground',
      action: () => console.log('Inventory check')
    },
    {
      id: '6',
      title: 'Generate Report',
      description: 'Create performance report',
      icon: 'DocumentChartBarIcon',
      color: 'bg-muted text-muted-foreground',
      action: () => console.log('Generate report')
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return 'ExclamationTriangleIcon';
      case 'message':
        return 'ChatBubbleLeftIcon';
      case 'alert':
        return 'BellAlertIcon';
      case 'reminder':
        return 'ClockIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-error bg-error/5';
    if (priority === 'medium') return 'border-l-warning bg-warning/5';
    return 'border-l-success bg-success/5';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Actions Grid */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex flex-col items-center p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action.icon} size={24} />
              </div>
              <h4 className="font-medium text-sm text-card-foreground mb-1">{action.title}</h4>
              <p className="text-xs text-muted-foreground text-center">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Center */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
              Mark all as read
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 hover:bg-muted/30 transition-colors duration-200 cursor-pointer ${
                    getNotificationColor(notification.type, notification.priority)
                  } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon 
                        name={getNotificationIcon(notification.type)} 
                        size={20} 
                        className={`${
                          notification.priority === 'high' ? 'text-error' :
                          notification.priority === 'medium'? 'text-warning' : 'text-success'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Icon name="BellIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications at the moment</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors duration-200">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;