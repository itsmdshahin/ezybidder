'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavigationProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

const BreadcrumbNavigation = ({ className = '', customItems }: BreadcrumbNavigationProps) => {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    const routeMap: Record<string, string> = {
      'vehicle-marketplace': 'Marketplace',
      'vehicle-details': 'Vehicle Details',
      'live-auction': 'Live Auction',
      'workshop-dashboard': 'Workshop Dashboard',
      'service-booking': 'Service Booking',
      'user-dashboard': 'Dashboard',
      'profile': 'Profile',
      'my-listings': 'My Listings',
      'bid-history': 'Bid History',
      'messages': 'Messages',
      'workshop-settings': 'Workshop Settings',
      'help': 'Help & Support',
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRightIcon" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.path}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;