import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import WorkshopDashboardInteractive from './components/WorkshopDashboardInteractive';

export const metadata: Metadata = {
  title: 'Workshop Dashboard - EzyBidder',
  description: 'Comprehensive SaaS management interface for automotive business operations, customer relationships, and service bookings with real-time analytics.',
};

export default function WorkshopDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BreadcrumbNavigation className="mb-6" />
          <WorkshopDashboardInteractive />
        </div>
      </main>
    </div>
  );
}