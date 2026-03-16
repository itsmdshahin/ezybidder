import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  bgColor: string;
}

interface QuickActionCardsProps {
  userRole: 'buyer' | 'seller' | 'workshop_owner';
}

const QuickActionCards = ({ userRole }: QuickActionCardsProps) => {
  const getActionsForRole = (): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        id: 'search',
        title: 'Search Vehicles',
        description: 'Find your perfect car',
        icon: 'MagnifyingGlassIcon',
        href: '/vehicle-marketplace',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      },
      {
        id: 'auction',
        title: 'Live Auctions',
        description: 'Bid on vehicles now',
        icon: 'FireIcon',
        href: '/live-auction',
        color: 'text-error',
        bgColor: 'bg-error/10'
      }
    ];

    if (userRole === 'seller') {
      return [
        ...commonActions,
        {
          id: 'create-listing',
          title: 'Create Listing',
          description: 'Sell your vehicle',
          icon: 'PlusCircleIcon',
          href: '/create-listing',
          color: 'text-success',
          bgColor: 'bg-success/10'
        },
        {
          id: 'manage-listings',
          title: 'Manage Listings',
          description: 'View your active ads',
          icon: 'RectangleStackIcon',
          href: '/my-listings',
          color: 'text-secondary',
          bgColor: 'bg-secondary/10'
        }
      ];
    }

    if (userRole === 'workshop_owner') {
      return [
        ...commonActions,
        {
          id: 'workshop-dashboard',
          title: 'Workshop Dashboard',
          description: 'Manage your workshop',
          icon: 'WrenchScrewdriverIcon',
          href: '/workshop-dashboard',
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        },
        {
          id: 'service-bookings',
          title: 'Service Bookings',
          description: 'View appointments',
          icon: 'CalendarDaysIcon',
          href: '/service-booking',
          color: 'text-success',
          bgColor: 'bg-success/10'
        }
      ];
    }

    return [
      ...commonActions,
      {
        id: 'saved-vehicles',
        title: 'Saved Vehicles',
        description: 'Your wishlist items',
        icon: 'HeartIcon',
        href: '/saved-vehicles',
        color: 'text-error',
        bgColor: 'bg-error/10'
      },
      {
        id: 'bid-history',
        title: 'Bid History',
        description: 'Track your bids',
        icon: 'ClockIcon',
        href: '/bid-history',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10'
      }
    ];
  };

  const actions = getActionsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className={`${action.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
              <Icon name={action.icon} size={24} className={action.color} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors duration-200">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActionCards;