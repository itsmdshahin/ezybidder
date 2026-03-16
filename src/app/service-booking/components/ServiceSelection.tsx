'use client';

import { useState } from 'react';
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

interface ServiceSelectionProps {
  services: Service[];
  selectedServices: number[];
  onServiceToggle: (serviceId: number) => void;
}

const ServiceSelection = ({ services, selectedServices, onServiceToggle }: ServiceSelectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Services', icon: 'RectangleStackIcon' },
    { id: 'denting', name: 'Denting', icon: 'WrenchScrewdriverIcon' },
    { id: 'painting', name: 'Painting', icon: 'PaintBrushIcon' },
    { id: 'servicing', name: 'Servicing', icon: 'CogIcon' },
    { id: 'accessories', name: 'Accessories', icon: 'ShoppingBagIcon' },
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-6">Select Services</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={category.icon} size={16} />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => onServiceToggle(service.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={service.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">{formatPrice(service.price)}</p>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                    isSelected 
                      ? 'border-primary bg-primary' :'border-muted-foreground'
                  }`}>
                    {isSelected && (
                      <Icon name="CheckIcon" size={12} className="text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <Icon name="ExclamationTriangleIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No services available in this category</p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;