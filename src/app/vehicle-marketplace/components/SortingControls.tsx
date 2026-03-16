'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  value: string;
  label: string;
  icon: string;
}

interface SortingControlsProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
  resultCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const SortingControls = ({ 
  currentSort, 
  onSortChange, 
  resultCount, 
  viewMode, 
  onViewModeChange 
}: SortingControlsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Most Relevant', icon: 'StarIcon' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUpIcon' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDownIcon' },
    { value: 'mileage-low', label: 'Mileage: Low to High', icon: 'ArrowUpIcon' },
    { value: 'mileage-high', label: 'Mileage: High to Low', icon: 'ArrowDownIcon' },
    { value: 'year-new', label: 'Year: Newest First', icon: 'ArrowDownIcon' },
    { value: 'year-old', label: 'Year: Oldest First', icon: 'ArrowUpIcon' },
    { value: 'date-new', label: 'Recently Listed', icon: 'ClockIcon' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.label : 'Sort by';
  };

  const formatResultCount = (count: number) => {
    return new Intl.NumberFormat('en-GB').format(count);
  };

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4 mb-6">
      {/* Results Count */}
      <div className="flex items-center space-x-2">
        <Icon name="MagnifyingGlassIcon" size={20} className="text-muted-foreground" />
        <span className="text-card-foreground">
          <span className="font-semibold">{formatResultCount(resultCount)}</span> vehicles found
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors duration-200 ${
              viewMode === 'grid' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Squares2X2Icon" size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md transition-colors duration-200 ${
              viewMode === 'list' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="ListBulletIcon" size={18} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <Icon name="BarsArrowDownIcon" size={18} className="text-muted-foreground" />
            <span className="text-foreground text-sm font-medium">{getCurrentSortLabel()}</span>
            <Icon 
              name={isDropdownOpen ? "ChevronUpIcon" : "ChevronDownIcon"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      currentSort === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-popover-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={option.icon} 
                      size={16} 
                      className={currentSort === option.value ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                    <span>{option.label}</span>
                    {currentSort === option.value && (
                      <Icon name="CheckIcon" size={16} className="text-primary-foreground ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortingControls;