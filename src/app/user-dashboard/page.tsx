import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import UserDashboardInteractive from './components/UserDashboardInteractive';

export const metadata: Metadata = {
  title: 'User Dashboard - EzyBidder',
  description: 'Manage your marketplace activity, saved vehicles, listings, and account settings in your personalized dashboard.',
};

export default function UserDashboardPage() {
  // Mock user role - in real app this would come from authentication
  const userRole: 'buyer' | 'seller' | 'workshop_owner' = 'seller';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation className="mb-6" />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's an overview of your marketplace activity and account status.
            </p>
          </div>

          {/* Interactive Dashboard Content */}
          <UserDashboardInteractive userRole={userRole} />
        </div>
      </main>
    </div>
  );
}