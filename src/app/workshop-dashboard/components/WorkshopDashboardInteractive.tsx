'use client';

import { useState, useEffect } from 'react';
import MetricsCard from './MetricsCard';
import CalendarBooking from './CalendarBooking';
import ActiveJobsTable from './ActiveJobsTable';
import CustomerManagement from './CustomerManagement';
import RevenueAnalytics from './RevenueAnalytics';
import QuickActions from './QuickActions';
import Icon from '@/components/ui/AppIcon';

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  period: string;
}

const WorkshopDashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'jobs' | 'customers' | 'analytics'>('overview');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-muted rounded-lg"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metricsData: MetricData[] = [
    {
      title: 'Total Bookings',
      value: 156,
      change: 12.5,
      changeType: 'increase',
      icon: 'CalendarDaysIcon',
      period: 'vs last month'
    },
    {
      title: 'Monthly Revenue',
      value: '£18,450',
      change: 8.3,
      changeType: 'increase',
      icon: 'CurrencyPoundIcon',
      period: 'vs last month'
    },
    {
      title: 'Customer Rating',
      value: '4.8/5',
      change: 2.1,
      changeType: 'increase',
      icon: 'StarIcon',
      period: 'vs last month'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: -1.2,
      changeType: 'decrease',
      icon: 'CheckCircleIcon',
      period: 'vs last month'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Workshop Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your automotive business operations and customer relationships
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200">
                <Icon name="PlusIcon" size={16} />
                <span className="hidden sm:inline">New Booking</span>
              </button>
              <button className="p-2 border border-border rounded-md hover:bg-muted transition-colors duration-200">
                <Icon name="Cog6ToothIcon" size={20} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: 'HomeIcon' },
                { id: 'calendar', label: 'Calendar', icon: 'CalendarDaysIcon' },
                { id: 'jobs', label: 'Jobs', icon: 'WrenchScrewdriverIcon' },
                { id: 'customers', label: 'Customers', icon: 'UserGroupIcon' },
                { id: 'analytics', label: 'Analytics', icon: 'ChartBarIcon' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                period={metric.period}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Calendar - Takes 2 columns */}
            <div className="lg:col-span-2">
              <CalendarBooking />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Active Jobs Table */}
          <div className="mb-8">
            <ActiveJobsTable />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Management */}
            <CustomerManagement />

            {/* Revenue Analytics */}
            <RevenueAnalytics />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-2 gap-4">
                {metricsData.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    changeType={metric.changeType}
                    icon={metric.icon}
                    period={metric.period}
                  />
                ))}
              </div>
              <QuickActions />
            </div>
          )}

          {activeTab === 'calendar' && <CalendarBooking />}
          {activeTab === 'jobs' && <ActiveJobsTable />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'analytics' && <RevenueAnalytics />}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDashboardInteractive;