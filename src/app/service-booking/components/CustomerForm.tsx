'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

const CustomerForm = ({ customerInfo, onCustomerInfoChange }: CustomerFormProps) => {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateField = (name: keyof CustomerInfo, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^(\+44|0)[1-9]\d{8,9}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid UK phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'vehicleReg':
        if (value && !/^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/.test(value.toUpperCase())) {
          newErrors.vehicleReg = 'Please enter a valid UK registration (e.g., AB12 CDE)';
        } else {
          delete newErrors.vehicleReg;
        }
        break;
      default:
        if (value.trim() === '' && ['firstName', 'lastName', 'email', 'phone'].includes(name)) {
          newErrors[name] = 'This field is required';
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const handleInputChange = (name: keyof CustomerInfo, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [name]: value
    });
    validateField(name, value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const carMakes = [
    'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Land Rover',
    'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Vauxhall', 'Volkswagen'
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-6">Customer Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-card-foreground mb-4">Personal Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.firstName ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-error">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.lastName ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-error">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.phone ? 'border-error' : 'border-border'
              }`}
              placeholder="07123 456789"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Contact Preference
            </label>
            <div className="space-y-2">
              {[
                { value: 'email', label: 'Email', icon: 'EnvelopeIcon' },
                { value: 'phone', label: 'Phone', icon: 'PhoneIcon' },
                { value: 'both', label: 'Both Email & Phone', icon: 'ChatBubbleLeftRightIcon' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactPreference"
                    value={option.value}
                    checked={customerInfo.contactPreference === option.value}
                    onChange={(e) => handleInputChange('contactPreference', e.target.value as any)}
                    className="w-4 h-4 text-primary border-border focus:ring-ring"
                  />
                  <Icon name={option.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-card-foreground mb-4">Vehicle Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Make
            </label>
            <select
              value={customerInfo.vehicleMake}
              onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select make</option>
              {carMakes.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Model
            </label>
            <input
              type="text"
              value={customerInfo.vehicleModel}
              onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="e.g., Focus, Golf, A4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Year
            </label>
            <select
              value={customerInfo.vehicleYear}
              onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Registration Number
            </label>
            <input
              type="text"
              value={customerInfo.vehicleReg}
              onChange={(e) => handleInputChange('vehicleReg', e.target.value.toUpperCase())}
              className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.vehicleReg ? 'border-error' : 'border-border'
              }`}
              placeholder="AB12 CDE"
              maxLength={8}
            />
            {errors.vehicleReg && (
              <p className="mt-1 text-sm text-error">{errors.vehicleReg}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Special Requests or Notes
            </label>
            <textarea
              value={customerInfo.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Any specific requirements, preferred times, or additional information..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;