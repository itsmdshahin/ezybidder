'use client';

import Icon from '@/components/ui/AppIcon';

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
  phone: string;
  email: string;
  address: string;
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
}

interface BookingSummaryProps {
  workshop: Workshop;
  selectedServices: Service[];
  selectedDate: Date | null;
  selectedTime: string | null;
  customerInfo: CustomerInfo;
  photoEstimate: number;
  onConfirmBooking: () => void;
  isProcessing: boolean;
}

const BookingSummary = ({
  workshop,
  selectedServices,
  selectedDate,
  selectedTime,
  customerInfo,
  photoEstimate,
  onConfirmBooking,
  isProcessing
}: BookingSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const subtotal = servicesTotal + photoEstimate;
  const vatRate = 0.20;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;
  const depositAmount = total * 0.20; // 20% deposit

  const isBookingValid = selectedServices.length > 0 && selectedDate && selectedTime && 
    customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone;

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-6">Booking Summary</h2>

      {/* Workshop Info */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-medium text-card-foreground mb-3">{workshop.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="MapPinIcon" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{workshop.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="PhoneIcon" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{workshop.phone}</span>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-medium text-card-foreground mb-3">Appointment</h3>
        {selectedDate && selectedTime ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="CalendarIcon" size={16} className="text-primary" />
              <span className="text-sm text-card-foreground">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="ClockIcon" size={16} className="text-primary" />
              <span className="text-sm text-card-foreground">{selectedTime}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Please select date and time</p>
        )}
      </div>

      {/* Vehicle Details */}
      {(customerInfo.vehicleMake || customerInfo.vehicleModel || customerInfo.vehicleReg) && (
        <div className="mb-6 pb-6 border-b border-border">
          <h3 className="font-medium text-card-foreground mb-3">Vehicle</h3>
          <div className="space-y-1 text-sm">
            {customerInfo.vehicleMake && customerInfo.vehicleModel && (
              <p className="text-card-foreground">
                {customerInfo.vehicleYear} {customerInfo.vehicleMake} {customerInfo.vehicleModel}
              </p>
            )}
            {customerInfo.vehicleReg && (
              <p className="text-muted-foreground font-mono">{customerInfo.vehicleReg}</p>
            )}
          </div>
        </div>
      )}

      {/* Selected Services */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-medium text-card-foreground mb-3">Selected Services</h3>
        {selectedServices.length > 0 ? (
          <div className="space-y-3">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={service.icon} size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.duration}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}
            
            {photoEstimate > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="PhotoIcon" size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Damage Repair</p>
                    <p className="text-xs text-muted-foreground">AI Estimate</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {formatPrice(photoEstimate)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No services selected</p>
        )}
      </div>

      {/* Pricing Breakdown */}
      {selectedServices.length > 0 && (
        <div className="mb-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (20%)</span>
              <span className="text-card-foreground">{formatPrice(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
              <span className="text-card-foreground">Total</span>
              <span className="text-card-foreground">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-primary">
              <span>Deposit Required (20%)</span>
              <span className="font-medium">{formatPrice(depositAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Button */}
      <button
        onClick={onConfirmBooking}
        disabled={!isBookingValid || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isBookingValid && !isProcessing
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin">
              <Icon name="ArrowPathIcon" size={16} />
            </div>
            <span>Processing...</span>
          </div>
        ) : (
          `Confirm Booking ${selectedServices.length > 0 ? `• ${formatPrice(depositAmount)} Deposit` : ''}`
        )}
      </button>

      {!isBookingValid && (
        <div className="mt-4 p-3 bg-warning/10 text-warning rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="ExclamationTriangleIcon" size={16} className="mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Complete Required Fields:</p>
              <ul className="text-xs space-y-1">
                {selectedServices.length === 0 && <li>• Select at least one service</li>}
                {!selectedDate && <li>• Choose appointment date</li>}
                {!selectedTime && <li>• Select time slot</li>}
                {!customerInfo.firstName && <li>• Enter first name</li>}
                {!customerInfo.lastName && <li>• Enter last name</li>}
                {!customerInfo.email && <li>• Provide email address</li>}
                {!customerInfo.phone && <li>• Add phone number</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-muted-foreground">
        <p>• Final quote will be provided after inspection</p>
        <p>• Deposit is refundable if booking is cancelled 24h in advance</p>
        <p>• Payment processed securely via FCA-regulated provider</p>
      </div>
    </div>
  );
};

export default BookingSummary;