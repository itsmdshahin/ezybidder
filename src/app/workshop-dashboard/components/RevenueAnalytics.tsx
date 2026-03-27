'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface RevenueAnalyticsProps {
  className?: string;
}

const RevenueAnalytics = ({ className = '' }: RevenueAnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'services' | 'breakdown'>('revenue');

  const revenueData = [
    { name: 'Jan', revenue: 12400, services: 45, target: 15000 },
    { name: 'Feb', revenue: 13200, services: 52, target: 15000 },
    { name: 'Mar', revenue: 15800, services: 61, target: 15000 },
    { name: 'Apr', revenue: 14600, services: 58, target: 15000 },
    { name: 'May', revenue: 16200, services: 64, target: 15000 },
    { name: 'Jun', revenue: 18400, services: 72, target: 15000 },
    { name: 'Jul', revenue: 17800, services: 69, target: 15000 },
    { name: 'Aug', revenue: 19200, services: 75, target: 15000 },
    { name: 'Sep', revenue: 16800, services: 66, target: 15000 },
    { name: 'Oct', revenue: 18600, services: 71, target: 15000 },
    { name: 'Nov', revenue: 20200, services: 78, target: 15000 }
  ];

  const serviceBreakdown = [
    { name: 'MOT & Service', value: 35, color: '#1E3A8A' },
    { name: 'Repairs', value: 28, color: '#F59E0B' },
    { name: 'Denting & Painting', value: 22, color: '#10B981' },
    { name: 'Tyres', value: 10, color: '#EF4444' },
    { name: 'Accessories', value: 5, color: '#8B5CF6' }
  ];

  const subscriptionTiers = [
    {
      name: 'Basic',
      current: true,
      price: '£49',
      period: '/month',
      features: ['Up to 50 bookings/month', 'Basic calendar', 'Customer management', 'Email support'],
      usage: { bookings: 32, limit: 50 }
    },
    {
      name: 'Standard',
      current: false,
      price: '£99',
      period: '/month',
      features: ['Up to 150 bookings/month', 'Advanced calendar', 'SMS notifications', 'Analytics dashboard', 'Priority support'],
      usage: null
    },
    {
      name: 'Premium',
      current: false,
      price: '£199',
      period: '/month',
      features: ['Unlimited bookings', 'Full analytics suite', 'API access', 'Custom integrations', 'Dedicated support'],
      usage: null
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-popover-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : `${entry.value} services`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Revenue Analytics</h3>
          <div className="flex items-center space-x-3">
            <div className="flex bg-muted rounded-md p-1">
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                    selectedPeriod === period
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          {(['revenue', 'services', 'breakdown'] as const).map((chart) => (
            <button
              key={chart}
              onClick={() => setSelectedChart(chart)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedChart === chart
                  ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {chart === 'revenue' ? 'Revenue Trend' : chart === 'services' ? 'Service Volume' : 'Service Breakdown'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {selectedChart === 'revenue' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `£${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Line dataKey="target" stroke="#EF4444" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === 'services' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {selectedChart === 'breakdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-card-foreground">Service Categories</h4>
              {serviceBreakdown.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: service.color }}
                    ></div>
                    <span className="text-sm font-medium text-card-foreground">{service.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{service.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Management */}
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="font-medium text-card-foreground mb-4">Subscription Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  tier.current 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary ring-opacity-20' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-card-foreground">{tier.name}</h5>
                  {tier.current && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">Current</span>
                  )}
                </div>
                <div className="flex items-baseline space-x-1 mb-4">
                  <span className="text-2xl font-bold text-card-foreground">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                
                {tier.usage && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Bookings Used</span>
                      <span className="text-card-foreground">{tier.usage.bookings}/{tier.usage.limit}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(tier.usage.bookings / tier.usage.limit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <Icon name="CheckIcon" size={14} className="text-success" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    tier.current
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  disabled={tier.current}
                >
                  {tier.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;