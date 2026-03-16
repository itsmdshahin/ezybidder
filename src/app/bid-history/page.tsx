import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import BidHistoryClient from './components/BidHistoryClient';

export const metadata = {
  title: 'My Bid History - EzyBidder',
  description: 'View all your auction bid activity.',
};

export default function BidHistoryPage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Bid History', path: '/bid-historys' },
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
          <BidHistoryClient />
        </div>
      </main>
    </div>
  );
}
