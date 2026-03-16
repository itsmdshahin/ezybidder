'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase as supabaseBrowser } from '@/lib/supabaseClient';

import VehicleImageGallery from './VehicleImageGallery';
import VehicleSpecifications from './VehicleSpecifications';
import PriceAnalysis from './PriceAnalysis';
import SellerInformation from './SellerInformation';
import ActionButtons from './ActionButtons';

interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  doors: number;
  engine: string;
  isAuction: boolean;
  currentBid?: number;
  timeRemaining?: string;
  description: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    thumbnail?: string;
  }>;
  specifications: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  motHistory: Array<{
    id: string | number;
    date: string;
    result: 'Pass' | 'Fail' | 'Advisory';
    mileage: number;
    expiryDate: string;
    advisories?: string[];
  }>;
  serviceHistory: Array<{
    id: string | number;
    date: string;
    type: string;
    garage: string;
    mileage: number;
    cost: number;
  }>;
  seller: {
    id: string;
    name: string;
    type: 'Private' | 'Dealer' | 'Showroom';
    rating: number;
    reviewCount: number;
    location: string;
    verified: boolean;
    memberSince: string;
    responseTime: string;
    avatar: string;
    avatarAlt: string;
  };
  priceAnalysis: {
    marketAverage: number;
    priceScore: number;
    priceHistory: Array<{ date: string; price: number }>;
    similarVehicles: Array<{
      id: string | number;
      make: string;
      model: string;
      year: number;
      mileage: number;
      price: number;
      location: string;
    }>;
  };
}

interface VehicleDetailsInteractiveProps {
  vehicleData: VehicleData;
}

const VehicleDetailsInteractive = ({ vehicleData }: VehicleDetailsInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] =
    useState<'specs' | 'price' | 'history'>('specs');

  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAddToWishlist = () => {
    if (!isHydrated) return;
    console.log('Added to wishlist:', vehicleData.id);
  };

  const handleCompare = () => {
    if (!isHydrated) return;
    console.log('Compare vehicle:', vehicleData.id);
  };

  const handleFinanceCalculator = () => {
    if (!isHydrated) return;
    console.log('Open finance calculator for:', vehicleData.id);
  };

  const handlePlaceBid = (amount: number) => {
    if (!isHydrated) return;
    console.log('Place bid:', amount, 'for vehicle:', vehicleData.id);
  };

  const handleBuyNow = () => {
    if (!isHydrated) return;
    console.log('Buy now:', vehicleData.id);
  };

  // 🔥 seller এর সাথে chat শুরু
  const handleMessage = async () => {
    if (!isHydrated) return;

    const {
      data: { session },
      error: sessionError,
    } = await supabaseBrowser.auth.getSession();

    if (sessionError) {
      console.error('[VehicleDetailsInteractive] session error:', sessionError);
    }

    const token = session?.access_token;
    if (!token) {
      alert('Please sign in to contact the seller.');
      return;
    }

    try {
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seller_id: vehicleData.seller.id,
          vehicle_id: vehicleData.id,
          // message: `Hi, I'm interested in your ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}.`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to start chat:', data?.error);
        alert(data?.error || 'Failed to start chat');
        return;
      }

      const conversationId = data.conversationId || data.id;
      if (!conversationId) {
        alert('Conversation could not be created');
        return;
      }

      // ✅ এখানেই মূল পরিবর্তন:
      // আগে ছিল: router.push(`/chat?conversationId=${conversationId}`);
      router.push(`/chat/${conversationId}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Something went wrong while starting chat');
    }
  };

  const handleCall = () => {
    if (!isHydrated) return;
    console.log('Call seller:', vehicleData.seller.id);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-[4/3] bg-muted rounded-lg" />
                <div className="h-64 bg-muted rounded-lg" />
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-64 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mileageText =
    typeof vehicleData.mileage === 'number'
      ? vehicleData.mileage.toLocaleString()
      : '—';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {vehicleData.year} {vehicleData.make} {vehicleData.model}
          </h1>
          <p className="text-lg text-muted-foreground">
            {mileageText} miles • {vehicleData.fuelType || '—'} • {vehicleData.transmission || '—'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <VehicleImageGallery
              images={vehicleData.images}
              vehicleName={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
            />

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {vehicleData.description}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'specs'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('price')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'price'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Price Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === 'history'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    History
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'specs' && (
                  <VehicleSpecifications
                    specifications={vehicleData.specifications}
                    motHistory={vehicleData.motHistory}
                    serviceHistory={vehicleData.serviceHistory}
                  />
                )}
                {activeTab === 'price' && (
                  <PriceAnalysis
                    currentPrice={vehicleData.price}
                    marketAverage={vehicleData.priceAnalysis.marketAverage}
                    priceScore={vehicleData.priceAnalysis.priceScore}
                    priceHistory={vehicleData.priceAnalysis.priceHistory}
                    similarVehicles={vehicleData.priceAnalysis.similarVehicles}
                  />
                )}
                {activeTab === 'history' && (
                  <VehicleSpecifications
                    specifications={vehicleData.specifications}
                    motHistory={vehicleData.motHistory}
                    serviceHistory={vehicleData.serviceHistory}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ActionButtons
              vehicleId={vehicleData.id}
              price={vehicleData.price}
              isAuction={vehicleData.isAuction}
              currentBid={vehicleData.currentBid}
              timeRemaining={vehicleData.timeRemaining}
              onAddToWishlist={handleAddToWishlist}
              onCompare={handleCompare}
              onFinanceCalculator={handleFinanceCalculator}
              onPlaceBid={handlePlaceBid}
              onBuyNow={handleBuyNow}
            />

            <SellerInformation
              seller={vehicleData.seller}
              onMessage={handleMessage}
              onCall={handleCall}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsInteractive;
