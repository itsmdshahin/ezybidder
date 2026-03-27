'use client';

import { useState, useEffect } from 'react';
import UserProfileCard from './UserProfileCard';
import QuickActionCards from './QuickActionCards';
import ActivityFeed from './ActivityFeed';
import SavedVehicles from './SavedVehicles';
import ListingManagement from './ListingManagement';
import FinancialSummary from './FinancialSummary';
import NotificationCenter from './NotificationCenter';

interface UserDashboardInteractiveProps {
  userRole: 'buyer' | 'seller' | 'workshop_owner';
}

const UserDashboardInteractive = ({ userRole }: UserDashboardInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-8">
                <div className="h-48 bg-muted rounded-lg"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  // Mock user data
  const mockUser = {
    id: "user_001",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_193860e2d-1762249186510.png",
    alt: "Professional headshot of middle-aged man with short brown hair wearing navy blue suit jacket",
    role: userRole,
    verificationLevel: userRole === 'workshop_owner' ? 'premium' : 'basic' as 'unverified' | 'basic' | 'premium',
    memberSince: "2022",
    location: "London, UK",
    rating: 4.8,
    totalTransactions: 23
  };

  // Mock activities
  const mockActivities = [
  {
    id: "act_001",
    type: "bid" as const,
    title: "Bid placed successfully",
    description: "Your bid of £15,500 on 2019 BMW 3 Series has been placed",
    timestamp: "2024-11-14T11:30:00Z",
    status: "success" as const,
    amount: "£15,500"
  },
  {
    id: "act_002",
    type: "message" as const,
    title: "New message received",
    description: "Seller responded to your inquiry about the Audi A4",
    timestamp: "2024-11-14T10:15:00Z",
    status: "pending" as const
  },
  {
    id: "act_003",
    type: "listing" as const,
    title: "Listing approved",
    description: "Your 2020 Mercedes C-Class listing is now live",
    timestamp: "2024-11-14T09:45:00Z",
    status: "success" as const
  },
  {
    id: "act_004",
    type: "payment" as const,
    title: "Payment processed",
    description: "Commission payment of £750 has been processed",
    timestamp: "2024-11-13T16:20:00Z",
    status: "success" as const,
    amount: "£750"
  }];


  // Mock saved vehicles
  const mockSavedVehicles = [
  {
    id: "veh_001",
    make: "BMW",
    model: "3 Series",
    year: 2019,
    price: 18500,
    previousPrice: 19000,
    mileage: 45000,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1606385408575-ed00d1c51263",
    alt: "Silver BMW 3 Series sedan parked on modern city street with glass buildings in background",
    location: "Manchester",
    savedDate: "2024-11-10T00:00:00Z",
    priceChange: "decreased" as const
  },
  {
    id: "veh_002",
    make: "Audi",
    model: "A4",
    year: 2020,
    price: 22000,
    mileage: 32000,
    fuelType: "Diesel",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1613530848263-424023f8c5de",
    alt: "Black Audi A4 sedan positioned on empty parking lot with modern architecture backdrop",
    location: "Birmingham",
    savedDate: "2024-11-08T00:00:00Z",
    priceChange: "same" as const
  }];


  // Mock listings for sellers
  const mockListings = [
  {
    id: "list_001",
    title: "2020 Mercedes C-Class AMG Line",
    price: 28500,
    image: "https://images.unsplash.com/photo-1622509634151-617abb3d493b",
    alt: "White Mercedes C-Class sedan with AMG styling package parked in luxury dealership showroom",
    status: "active" as const,
    views: 156,
    inquiries: 8,
    createdDate: "2024-11-01T00:00:00Z",
    expiryDate: "2024-12-01T00:00:00Z",
    featured: true
  },
  {
    id: "list_002",
    title: "2018 Volkswagen Golf GTI",
    price: 16800,
    image: "https://images.unsplash.com/photo-1565756875620-3e1b865daac0",
    alt: "Red Volkswagen Golf GTI hatchback on winding mountain road with forest scenery",
    status: "pending" as const,
    views: 89,
    inquiries: 3,
    createdDate: "2024-10-28T00:00:00Z",
    expiryDate: "2024-11-28T00:00:00Z",
    featured: false
  }];


  // Mock transactions
  const mockTransactions = [
  {
    id: "txn_001",
    type: "sale" as const,
    description: "Vehicle sale - 2019 Ford Focus",
    amount: 12500,
    date: "2024-11-10T00:00:00Z",
    status: "completed" as const
  },
  {
    id: "txn_002",
    type: "commission" as const,
    description: "Platform commission (5%)",
    amount: 625,
    date: "2024-11-10T00:00:00Z",
    status: "completed" as const
  },
  {
    id: "txn_003",
    type: "purchase" as const,
    description: "Vehicle purchase - 2020 Toyota Corolla",
    amount: 15800,
    date: "2024-11-05T00:00:00Z",
    status: "completed" as const
  }];


  // Mock notifications
  const mockNotifications = [
  {
    id: "not_001",
    type: "auction" as const,
    title: "Auction ending soon",
    message: "2018 BMW X5 auction ends in 15 minutes. Current bid: £24,500",
    timestamp: "2024-11-14T12:45:00Z",
    read: false,
    priority: "high" as const,
    actionUrl: "/live-auction/auction_001"
  },
  {
    id: "not_002",
    type: "message" as const,
    title: "New message from seller",
    message: "John Smith replied to your inquiry about the Mercedes C-Class",
    timestamp: "2024-11-14T11:20:00Z",
    read: false,
    priority: "medium" as const,
    actionUrl: "/messages/msg_001"
  },
  {
    id: "not_003",
    type: "payment" as const,
    title: "Payment confirmation",
    message: "Your payment of £18,500 has been processed successfully",
    timestamp: "2024-11-13T14:30:00Z",
    read: true,
    priority: "low" as const
  }];


  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      <UserProfileCard user={mockUser} />

      {/* Quick Actions */}
      <QuickActionCards userRole={userRole} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Feed */}
          <ActivityFeed activities={mockActivities} />

          {/* Role-specific content */}
          {userRole === 'buyer' &&
          <SavedVehicles vehicles={mockSavedVehicles} />
          }

          {(userRole === 'seller' || userRole === 'workshop_owner') &&
          <ListingManagement listings={mockListings} />
          }
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Notifications */}
          <NotificationCenter notifications={mockNotifications} />

          {/* Financial Summary */}
          {(userRole === 'seller' || userRole === 'workshop_owner') &&
          <FinancialSummary
            transactions={mockTransactions}
            totalEarnings={25300}
            totalSpent={15800}
            pendingPayments={1200}
            commissionOwed={1265} />

          }
        </div>
      </div>
    </div>);

};

export default UserDashboardInteractive;