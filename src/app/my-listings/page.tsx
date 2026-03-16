import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import MyListingsClient from './components/MyListingsClient';

export const metadata: Metadata = {
  title: 'My Listings - EzyBidder',
  description: 'Manage your vehicle listings: add, edit, delete, and preview all your active and past auctions.',
};

export default function MyListingsPage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'My Listings', path: '/my-listings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadcrumbNavigation customItems={breadcrumbItems} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MyListingsClient />
        </div>
      </main>
    </div>
  );
}
