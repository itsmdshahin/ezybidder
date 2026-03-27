// src/app/admin/components/AdminDashboardInteractive.tsx
'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'auction' | 'report' | 'listing';
  title: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboardInteractive() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const stats: StatCard[] = [
    {
      label: 'Total Users',
      value: '12,543',
      change: '+8.2% from last month',
      icon: 'UsersIcon',
      color: 'text-blue-600',
    },
    {
      label: 'Active Auctions',
      value: '348',
      change: '+12.5% from last month',
      icon: 'FireIcon',
      color: 'text-orange-600',
    },
    {
      label: 'Total Listings',
      value: '2,891',
      change: '+5.3% from last month',
      icon: 'ArchiveBoxIcon',
      color: 'text-emerald-600',
    },
    {
      label: 'Platform Revenue',
      value: '$45,230',
      change: '+18.7% from last month',
      icon: 'CurrencyPoundIcon',
      color: 'text-amber-600',
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'user',
      title: 'New User Registration',
      description: 'John Doe registered as a seller',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'report',
      title: 'Fraud Report Filed',
      description: 'User reported suspicious listing activity',
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      type: 'auction',
      title: 'Auction Completed',
      description: '2018 BMW X5 sold for £28,500',
      timestamp: '6 hours ago',
    },
    {
      id: 4,
      type: 'listing',
      title: 'Listing Suspended',
      description: 'Vehicle listing suspended for policy violation',
      timestamp: '8 hours ago',
    },
  ];

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user':
        return 'UserPlusIcon';
      case 'auction':
        return 'CheckCircleIcon';
      case 'report':
        return 'ExclamationTriangleIcon';
      case 'listing':
        return 'NoSymbolIcon';
      default:
        return 'DocumentIcon';
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user':
        return 'text-success';
      case 'auction':
        return 'text-success';
      case 'report':
        return 'text-warning';
      case 'listing':
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="overflow-auto">
      {/* Header with Timeframe Selector */}
      <div className="sticky top-0 bg-background border-b border-border z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Platform Statistics</p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 capitalize ${
                  timeframe === period
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <Icon name={stat.icon as any} size={24} />
                </div>
              </div>
              <p className="text-sm text-success flex items-center gap-1">
                <Icon name="ArrowUpIcon" size={16} />
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users & Revenue Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Users & Revenue Trend
              </h3>
              <button className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Icon name="EllipsisHorizontalIcon" size={20} />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md border border-border">
              <p className="text-muted-foreground text-center">
                <Icon name="ChartBarIcon" size={32} className="mx-auto mb-2 opacity-50" />
                Chart Placeholder - Integrate Recharts or Charts.js
              </p>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Platform Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    System Uptime
                  </span>
                  <span className="text-sm font-semibold text-success">99.9%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    API Health
                  </span>
                  <span className="text-sm font-semibold text-success">98.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '98.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Database Health
                  </span>
                  <span className="text-sm font-semibold text-success">99.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '99.5%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Server Load
                  </span>
                  <span className="text-sm font-semibold text-warning">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-warning h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h3>
            <a
              href="/admin/reports"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
            >
              View All
              <Icon name="ArrowRightIcon" size={16} />
            </a>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary/20 transition-colors duration-200"
              >
                <div className={`p-2.5 rounded-lg bg-muted ${getActivityColor(activity.type)}`}>
                  <Icon name={getActivityIcon(activity.type) as any} size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
