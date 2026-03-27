import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  alt: string;
  status: 'active' | 'pending' | 'sold' | 'expired';
  views: number;
  inquiries: number;
  createdDate: string;
  expiryDate: string;
  featured: boolean;
}

interface ListingManagementProps {
  listings: Listing[];
}

const ListingManagement = ({ listings }: ListingManagementProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'text-success bg-success/10', label: 'Active' };
      case 'pending':
        return { color: 'text-warning bg-warning/10', label: 'Pending' };
      case 'sold':
        return { color: 'text-primary bg-primary/10', label: 'Sold' };
      case 'expired':
        return { color: 'text-error bg-error/10', label: 'Expired' };
      default:
        return { color: 'text-muted-foreground bg-muted', label: 'Unknown' };
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">My Listings</h3>
          <div className="flex items-center space-x-2">
            <Link
              href="/create-listing"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90 transition-colors duration-200"
            >
              <Icon name="PlusIcon" size={16} />
              <span>New Listing</span>
            </Link>
            <Link
              href="/my-listings"
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {listings.length > 0 ? (
          listings.slice(0, 5).map((listing) => {
            const statusBadge = getStatusBadge(listing.status);
            
            return (
              <div key={listing.id} className="p-6 hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <AppImage
                      src={listing.image}
                      alt={listing.alt}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {listing.featured && (
                      <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full p-1">
                        <Icon name="StarIcon" size={12} className="fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-card-foreground truncate">{listing.title}</h4>
                      <span className="text-lg font-semibold text-card-foreground">
                        {formatPrice(listing.price)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <Icon name="EyeIcon" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{listing.views}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Icon name="ChatBubbleLeftIcon" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{listing.inquiries}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Created {new Date(listing.createdDate).toLocaleDateString('en-GB')}
                      </span>
                      
                      <span className="text-sm text-muted-foreground">
                        {getDaysRemaining(listing.expiryDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/edit-listing/${listing.id}`}
                      className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name="PencilIcon" size={16} className="text-muted-foreground" />
                    </Link>
                    
                    <Link
                      href={`/vehicle-details/${listing.id}`}
                      className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name="EyeIcon" size={16} className="text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <Icon name="RectangleStackIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No listings yet</p>
            <Link
              href="/create-listing"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              <Icon name="PlusCircleIcon" size={16} />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingManagement;