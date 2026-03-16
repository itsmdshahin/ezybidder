'use client';

import { useState, useEffect } from 'react';
import WorkshopInfo from './WorkshopInfo';
import ServiceSelection from './ServiceSelection';
import BookingCalendar from './BookingCalendar';
import PhotoUpload from './PhotoUpload';
import CustomerForm from './CustomerForm';
import BookingSummary from './BookingSummary';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: 'denting' | 'painting' | 'servicing' | 'accessories';
  icon: string;
}

interface Workshop {
  id: number;
  name: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  openingHours: {
    [key: string]: string;
  };
  lat: number;
  lng: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleReg: string;
  specialRequests: string;
  contactPreference: 'email' | 'phone' | 'both';
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  analysis?: {
    damageType: string;
    severity: string;
    estimatedCost: number;
  };
}

const ServiceBookingInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleReg: '',
    specialRequests: '',
    contactPreference: 'both'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>);

  }

  const mockWorkshop: Workshop = {
    id: 1,
    name: "Mahdi Auto Care",
    image: "https://images.unsplash.com/photo-1727893141025-35d62b3f4a03",
    alt: "Modern automotive workshop with professional mechanics working on luxury vehicles under bright LED lighting",
    rating: 4.8,
    reviewCount: 247,
    address: "123 High Street, Birmingham, B1 2AB",
    phone: "0121 234 5678",
    email: "info@premiumautocare.co.uk",
    description: "Premium Auto Care has been serving Birmingham's automotive needs for over 15 years. We specialise in high-quality denting, painting, and servicing for all vehicle makes and models. Our certified technicians use the latest equipment and genuine parts to ensure your vehicle receives the best possible care.",
    specialties: ["Denting & Panel Beating", "Paint Restoration", "Full Service", "MOT Testing", "Diagnostics"],
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    lat: 52.4862,
    lng: -1.8904
  };

  const mockServices: Service[] = [
  {
    id: 1,
    name: "Minor Dent Repair",
    description: "Professional paintless dent removal for small to medium dents without affecting original paint",
    duration: "2-3 hours",
    price: 120,
    category: "denting",
    icon: "WrenchScrewdriverIcon"
  },
  {
    id: 2,
    name: "Panel Beating & Repair",
    description: "Complete panel restoration including metalwork, filling, and preparation for painting",
    duration: "1-2 days",
    price: 350,
    category: "denting",
    icon: "WrenchScrewdriverIcon"
  },
  {
    id: 3,
    name: "Scratch Repair & Touch-up",
    description: "Professional scratch removal and paint touch-up to restore original finish",
    duration: "3-4 hours",
    price: 180,
    category: "painting",
    icon: "PaintBrushIcon"
  },
  {
    id: 4,
    name: "Full Panel Respray",
    description: "Complete panel repainting with colour matching and professional finish",
    duration: "2-3 days",
    price: 450,
    category: "painting",
    icon: "PaintBrushIcon"
  },
  {
    id: 5,
    name: "Basic Service",
    description: "Oil change, filter replacement, and basic safety checks",
    duration: "1 hour",
    price: 85,
    category: "servicing",
    icon: "CogIcon"
  },
  {
    id: 6,
    name: "Full Service",
    description: "Comprehensive vehicle inspection, fluid changes, and component checks",
    duration: "3-4 hours",
    price: 195,
    category: "servicing",
    icon: "CogIcon"
  },
  {
    id: 7,
    name: "Alloy Wheel Refurbishment",
    description: "Professional wheel repair, refinishing, and protective coating application",
    duration: "1 day",
    price: 280,
    category: "accessories",
    icon: "ShoppingBagIcon"
  },
  {
    id: 8,
    name: "Window Tinting",
    description: "Professional window film application with UV protection and privacy enhancement",
    duration: "2-3 hours",
    price: 220,
    category: "accessories",
    icon: "ShoppingBagIcon"
  }];


  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
    prev.includes(serviceId) ?
    prev.filter((id) => id !== serviceId) :
    [...prev, serviceId]
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock booking confirmation
    const bookingRef = `BK${Date.now().toString().slice(-6)}`;
    alert(`Booking confirmed! Reference: ${bookingRef}\n\nYou will receive a confirmation email shortly with payment instructions for the deposit.`);

    setIsProcessing(false);
  };

  const selectedServiceDetails = mockServices.filter((service) =>
  selectedServices.includes(service.id)
  );

  const photoEstimate = uploadedPhotos.reduce((sum, photo) =>
  sum + (photo.analysis?.estimatedCost || 0), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <WorkshopInfo workshop={mockWorkshop} />
            
            <ServiceSelection
              services={mockServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle} />

            
            <BookingCalendar
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect} />

            
            <PhotoUpload
              photos={uploadedPhotos}
              onPhotosChange={setUploadedPhotos} />

            
            <CustomerForm
              customerInfo={customerInfo}
              onCustomerInfoChange={setCustomerInfo} />

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              workshop={mockWorkshop}
              selectedServices={selectedServiceDetails}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              customerInfo={customerInfo}
              photoEstimate={photoEstimate}
              onConfirmBooking={handleConfirmBooking}
              isProcessing={isProcessing} />

          </div>
        </div>
      </div>
    </div>);

};

export default ServiceBookingInteractive;