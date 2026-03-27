const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="h-12 bg-muted rounded-lg animate-pulse"></div>
      {/* Sorting Controls Skeleton */}
      <div className="h-16 bg-muted rounded-lg animate-pulse"></div>
      {/* Vehicle Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-muted animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-6 bg-muted rounded animate-pulse"></div>
              
              {/* Location */}
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
              
              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
              
              {/* Trust Signals */}
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
              </div>
              
              {/* Seller Info */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
              </div>
              
              {/* Price and Button */}
              <div className="flex justify-between items-center">
                <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;