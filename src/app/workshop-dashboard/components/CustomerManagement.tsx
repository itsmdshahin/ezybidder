'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalJobs: number;
  totalSpent: number;
  lastVisit: string;
  rating: number;
  status: 'active' | 'inactive' | 'vip';
  image: string;
  vehicleCount: number;
  nextService: string | null;
}

interface CustomerManagementProps {
  className?: string;
}

const CustomerManagement = ({ className = '' }: CustomerManagementProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      totalJobs: 12,
      totalSpent: 2450.00,
      lastVisit: '2024-11-10',
      rating: 4.8,
      status: 'vip',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      vehicleCount: 2,
      nextService: '2024-12-15'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+44 7700 900456',
      totalJobs: 8,
      totalSpent: 1680.00,
      lastVisit: '2024-11-12',
      rating: 4.9,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      vehicleCount: 1,
      nextService: '2024-11-25'
    },
    {
      id: '3',
      name: 'Robert Davis',
      email: 'robert.davis@email.com',
      phone: '+44 7700 900789',
      totalJobs: 15,
      totalSpent: 3200.00,
      lastVisit: '2024-11-08',
      rating: 4.7,
      status: 'vip',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      vehicleCount: 3,
      nextService: null
    },
    {
      id: '4',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 7700 900012',
      totalJobs: 3,
      totalSpent: 450.00,
      lastVisit: '2024-10-28',
      rating: 4.5,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      vehicleCount: 1,
      nextService: '2024-12-01'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="StarIcon"
        size={12}
        variant={i < Math.floor(rating) ? 'solid' : 'outline'}
        className={i < Math.floor(rating) ? 'text-accent' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Customer Management</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200">
            <Icon name="UserPlusIcon" size={16} />
            <span className="text-sm font-medium">Add Customer</span>
          </button>
        </div>
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <Icon 
              name="MagnifyingGlassIcon" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer ${
                selectedCustomer === customer.id ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
              onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <AppImage
                    src={customer.image}
                    alt={`Profile photo of ${customer.name}, workshop customer`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-card-foreground">{customer.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                        {customer.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(customer.rating)}
                      <span className="text-xs text-muted-foreground ml-1">({customer.rating})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-card-foreground">{customer.totalJobs}</p>
                      <p className="text-xs text-muted-foreground">Jobs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-card-foreground">£{customer.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-card-foreground">{customer.vehicleCount}</p>
                      <p className="text-xs text-muted-foreground">Vehicles</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCustomer === customer.id && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-card-foreground mb-2">Recent Activity</h5>
                      <p className="text-sm text-muted-foreground">Last visit: {new Date(customer.lastVisit).toLocaleDateString('en-GB')}</p>
                      {customer.nextService && (
                        <p className="text-sm text-muted-foreground">Next service: {new Date(customer.nextService).toLocaleDateString('en-GB')}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors duration-200">
                        <Icon name="ChatBubbleLeftIcon" size={14} />
                        <span>Message</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors duration-200">
                        <Icon name="CalendarIcon" size={14} />
                        <span>Book Service</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors duration-200">
                        <Icon name="DocumentTextIcon" size={14} />
                        <span>History</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <Icon name="UserGroupIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No customers found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;