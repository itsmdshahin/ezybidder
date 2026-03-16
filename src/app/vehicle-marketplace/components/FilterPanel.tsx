'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  make: string;
  model: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  minMileage: number;
  maxMileage: number;
  fuelType: string[];
  bodyType: string[];
  transmission: string[];
  location: string;
  radius: number;
  sellerType: string[];
  listingType: string[];
  motStatus: string[];
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  resultCount: number;
}

const FilterPanel = ({ filters, onFiltersChange, isOpen, onToggle, resultCount }: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const carMakes = [
    'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Land Rover', 
    'Mercedes-Benz', 'Nissan', 'Peugeot', 'Renault', 'Toyota', 'Vauxhall', 'Volkswagen'
  ];

  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];
  const bodyTypes = ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible', 'MPV'];
  const transmissionTypes = ['Manual', 'Automatic', 'Semi-Automatic'];
  const sellerTypes = ['Private', 'Dealer', 'Showroom'];
  const listingTypes = ['Fixed Price', 'Auction'];
  const motStatusOptions = ['Valid', 'Due Soon', 'Expired'];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleMultiSelectChange = (key: keyof FilterOptions, value: string) => {
    const currentValues = localFilters[key] as string[];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    handleFilterChange(key, updatedValues);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      make: '',
      model: '',
      minPrice: 0,
      maxPrice: 100000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      minMileage: 0,
      maxMileage: 200000,
      fuelType: [],
      bodyType: [],
      transmission: [],
      location: '',
      radius: 50,
      sellerType: [],
      listingType: [],
      motStatus: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full p-3 bg-card border border-border rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Icon name="FunnelIcon" size={20} className="text-foreground" />
            <span className="font-medium text-foreground">Filters</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{resultCount} results</span>
            <Icon 
              name={isOpen ? "ChevronUpIcon" : "ChevronDownIcon"} 
              size={20} 
              className="text-muted-foreground" 
            />
          </div>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`bg-card border border-border rounded-lg p-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Filters</h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-6">
          {/* Make & Model */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Make</label>
            <select
              value={localFilters.make}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any Make</option>
              {carMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 100000)}
                  className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatPrice(localFilters.minPrice)}</span>
              <span>{formatPrice(localFilters.maxPrice)}</span>
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Year</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="From"
                value={localFilters.minYear || ''}
                onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value) || 2000)}
                className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="To"
                value={localFilters.maxYear || ''}
                onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value) || new Date().getFullYear())}
                className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Mileage Range */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Mileage</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min miles"
                value={localFilters.minMileage || ''}
                onChange={(e) => handleFilterChange('minMileage', parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="Max miles"
                value={localFilters.maxMileage || ''}
                onChange={(e) => handleFilterChange('maxMileage', parseInt(e.target.value) || 200000)}
                className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Fuel Type</label>
            <div className="space-y-2">
              {fuelTypes.map(fuel => (
                <label key={fuel} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.fuelType.includes(fuel)}
                    onChange={() => handleMultiSelectChange('fuelType', fuel)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Body Type</label>
            <div className="space-y-2">
              {bodyTypes.map(body => (
                <label key={body} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.bodyType.includes(body)}
                    onChange={() => handleMultiSelectChange('bodyType', body)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{body}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Transmission</label>
            <div className="space-y-2">
              {transmissionTypes.map(trans => (
                <label key={trans} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.transmission.includes(trans)}
                    onChange={() => handleMultiSelectChange('transmission', trans)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{trans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter postcode or city"
              value={localFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-2"
            />
            <select
              value={localFilters.radius}
              onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
              className="w-full p-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={10}>Within 10 miles</option>
              <option value={25}>Within 25 miles</option>
              <option value={50}>Within 50 miles</option>
              <option value={100}>Within 100 miles</option>
              <option value={0}>Nationwide</option>
            </select>
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Seller Type</label>
            <div className="space-y-2">
              {sellerTypes.map(seller => (
                <label key={seller} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.sellerType.includes(seller)}
                    onChange={() => handleMultiSelectChange('sellerType', seller)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{seller}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Listing Type</label>
            <div className="space-y-2">
              {listingTypes.map(listing => (
                <label key={listing} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.listingType.includes(listing)}
                    onChange={() => handleMultiSelectChange('listingType', listing)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{listing}</span>
                </label>
              ))}
            </div>
          </div>

          {/* MOT Status */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">MOT Status</label>
            <div className="space-y-2">
              {motStatusOptions.map(status => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.motStatus.includes(status)}
                    onChange={() => handleMultiSelectChange('motStatus', status)}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;