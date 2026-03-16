// src/app/vehicle-marketplace/components/VehicleMarketplaceInteractive.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import VehicleCard from './VehicleCard';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';
import SortingControls from './SortingControls';
import ComparisonBar from './ComparisonBar';
import LoadingSkeleton from './LoadingSkeleton';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string;
  bodyType: string;
  transmission: string;
  engineSize: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  motStatus: 'valid' | 'expired' | 'due-soon';
  motExpiryDate: string;
  sellerType: 'private' | 'dealer' | 'showroom';
  sellerRating: number;
  listingType: 'fixed-price' | 'auction' | 'both';
  dvlaVerified: boolean;
  priceScore: 'excellent' | 'good' | 'fair' | 'high';
  location: string;
  isWishlisted: boolean;
  auctionEndTime?: string;
}

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

const VehicleMarketplaceInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
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
    motStatus: []
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchVehicles = async () => {
      setLoading(true);

      try {
        // Adjust select columns if you want to limit fields
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);

        if (error) {
          console.error('Supabase vehicles fetch error:', error);
          setVehicles([]);
          setFilteredVehicles([]);
          setLoading(false);
          return;
        }

        if (!data || !Array.isArray(data)) {
          setVehicles([]);
          setFilteredVehicles([]);
          setLoading(false);
          return;
        }

        // Helper to parse images stored as JSON string or array
        const parseImages = (imagesField: any) => {
          try {
            if (!imagesField) return [];
            if (Array.isArray(imagesField)) {
              return imagesField.map((i: any) =>
                typeof i === 'string' ? { url: i, alt: '' } : { url: i.url ?? '', alt: i.alt ?? '' }
              );
            }
            if (typeof imagesField === 'string') {
              const trimmed = imagesField.trim();
              if (trimmed.startsWith('[')) {
                const parsed = JSON.parse(trimmed);
                return parsed.map((i: any) => (typeof i === 'string' ? { url: i, alt: '' } : { url: i.url ?? '', alt: i.alt ?? '' }));
              }
              // if comma-separated
              return imagesField.split(',').map((u: string) => ({ url: u.trim(), alt: '' }));
            }
            // fallback single object
            if (imagesField.url) return [{ url: imagesField.url, alt: imagesField.alt ?? '' }];
          } catch (e) {
            return [];
          }
          return [];
        };

        // map DB rows to our client Vehicle shape
        const mapped: Vehicle[] = data.map((row: any) => {
          const imgs = parseImages(row.images);

          const listingTypeRaw = (row.listing_type ?? '').toString().toLowerCase();
          const listingType: Vehicle['listingType'] =
            listingTypeRaw.includes('auction') ? 'auction' : listingTypeRaw.includes('fixed') ? 'fixed-price' : 'both';

          const sellerTypeRaw = (row.seller_type ?? row.sellerType ?? '').toString().toLowerCase();
          const sellerType: Vehicle['sellerType'] =
            sellerTypeRaw.includes('dealer') ? 'dealer' : sellerTypeRaw.includes('showroom') ? 'showroom' : 'private';

          const fuelType = row.fuel_type ?? row.fuelType ?? 'Petrol';
          const transmission = row.transmission ?? 'Manual';
          const motExpiryDate = row.mot_expiry_date ?? row.motExpiryDate ?? '';
          const motStatus = (() => {
            // if motExpiryDate exists, compare with now
            try {
              const d = motExpiryDate ? new Date(motExpiryDate) : null;
              if (!d) return 'valid';
              const now = new Date();
              const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              if (diffDays < 0) return 'expired';
              if (diffDays <= 30) return 'due-soon';
              return 'valid';
            } catch {
              return 'valid';
            }
          })();

          // crude priceScore: you can replace with your own logic later
          const priceScore = ((): Vehicle['priceScore'] => {
            if (!row.price) return 'good';
            const priceNum = Number(row.price);
            if (priceNum <= 10000) return 'excellent';
            if (priceNum <= 25000) return 'good';
            if (priceNum <= 40000) return 'fair';
            return 'high';
          })();

          return {
            id: row.id,
            make: row.make ?? row.brand ?? 'Unknown',
            model: row.model ?? 'Model',
            year: Number(row.year) || 0,
            mileage: Number(row.mileage) || 0,
            price: Number(row.price) || 0,
            fuelType: fuelType,
            bodyType: row.body_type ?? row.bodyType ?? 'Hatchback',
            transmission: transmission,
            engineSize: row.engine_size ?? row.engine ?? '',
            images: imgs.length ? imgs : [{ url: '', alt: '' }],
            motStatus: motStatus as Vehicle['motStatus'],
            motExpiryDate: motExpiryDate ?? '',
            sellerType,
            sellerRating: Number(row.seller_rating) || 0,
            listingType,
            dvlaVerified: !!row.dvla_data,
            priceScore,
            location: row.location ?? '',
            isWishlisted: false,
            auctionEndTime: row.auction_end_time ?? row.end_time ?? undefined
          };
        });

        setVehicles(mapped);
        setFilteredVehicles(mapped);
      } catch (err) {
        console.error('Unexpected error fetching vehicles:', err);
        setVehicles([]);
        setFilteredVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [isHydrated]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(vehicles, filters, query, currentSort);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    applyFiltersAndSearch(vehicles, newFilters, searchQuery, currentSort);
  };

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);
    applyFiltersAndSearch(vehicles, filters, searchQuery, sortValue);
  };

  const applyFiltersAndSearch = (
    vehicleList: Vehicle[],
    currentFilters: FilterOptions,
    query: string,
    sort: string
  ) => {
    let filtered = [...vehicleList];

    // Apply search query
    if (query) {
      filtered = filtered.filter((vehicle) =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.fuelType.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.bodyType.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (currentFilters.make) {
      filtered = filtered.filter((vehicle) => vehicle.make === currentFilters.make);
    }

    if (currentFilters.minPrice > 0 || currentFilters.maxPrice < 100000) {
      filtered = filtered.filter((vehicle) =>
        vehicle.price >= currentFilters.minPrice && vehicle.price <= currentFilters.maxPrice
      );
    }

    if (currentFilters.minYear > 2000 || currentFilters.maxYear < new Date().getFullYear()) {
      filtered = filtered.filter((vehicle) =>
        vehicle.year >= currentFilters.minYear && vehicle.year <= currentFilters.maxYear
      );
    }

    if (currentFilters.fuelType.length > 0) {
      filtered = filtered.filter((vehicle) => currentFilters.fuelType.includes(vehicle.fuelType));
    }

    if (currentFilters.bodyType.length > 0) {
      filtered = filtered.filter((vehicle) => currentFilters.bodyType.includes(vehicle.bodyType));
    }

    if (currentFilters.transmission.length > 0) {
      filtered = filtered.filter((vehicle) => currentFilters.transmission.includes(vehicle.transmission));
    }

    if (currentFilters.sellerType.length > 0) {
      filtered = filtered.filter((vehicle) =>
        currentFilters.sellerType.map((s) => s.toLowerCase()).includes(vehicle.sellerType)
      );
    }

    // Apply sorting
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'mileage-low':
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'mileage-high':
        filtered.sort((a, b) => b.mileage - a.mileage);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredVehicles(filtered);
  };

  const handleWishlistToggle = (vehicleId: string) => {
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === vehicleId ?
        { ...vehicle, isWishlisted: !vehicle.isWishlisted } :
        vehicle
    );
    setVehicles(updatedVehicles);

    const updatedFiltered = filteredVehicles.map((vehicle) =>
      vehicle.id === vehicleId ?
        { ...vehicle, isWishlisted: !vehicle.isWishlisted } :
        vehicle
    );
    setFilteredVehicles(updatedFiltered);
  };

  const handleCompareToggle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const isSelected = selectedVehicles.some((v) => v.id === vehicleId);

    if (isSelected) {
      setSelectedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } else if (selectedVehicles.length < 3) {
      setSelectedVehicles((prev) => [...prev, vehicle]);
    }
  };

  const handleCompareVehicles = () => {
    console.log('Comparing vehicles:', selectedVehicles);
    // Navigate to comparison page
  };

  const handleClearComparison = () => {
    setSelectedVehicles([]);
  };

  const handleRemoveFromComparison = (vehicleId: string) => {
    setSelectedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  if (!isHydrated) {
    return <LoadingSkeleton />;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              resultCount={filteredVehicles.length} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                initialValue={searchQuery} />
            </div>

            {/* Sorting Controls */}
            <SortingControls
              currentSort={currentSort}
              onSortChange={handleSortChange}
              resultCount={filteredVehicles.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode} />

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ?
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredVehicles.map((vehicle) =>
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onWishlistToggle={handleWishlistToggle}
                    onCompareToggle={handleCompareToggle}
                    isSelected={selectedVehicles.some((v) => v.id === vehicle.id)} />
                )}
              </div> :

              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V3a1 1 0 00-1-1H8a1 1 0 00-1 1v3.306" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to find more vehicles.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
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
                        motStatus: []
                      });
                      setFilteredVehicles(vehicles);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200">
                    Clear All Filters
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedVehicles={selectedVehicles}
        onRemoveVehicle={handleRemoveFromComparison}
        onCompareVehicles={handleCompareVehicles}
        onClearAll={handleClearComparison} />

    </div>);

};

export default VehicleMarketplaceInteractive;
