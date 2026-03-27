import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import VehicleMarketplaceInteractive from './components/VehicleMarketplaceInteractive';

export const metadata: Metadata = {
  title: 'Vehicle Marketplace - EzyBidder',
  description: 'Discover and filter available cars through comprehensive search functionality. Browse verified vehicles with MOT status, seller ratings, and competitive pricing across the UK.',
};

export default function VehicleMarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BreadcrumbNavigation />
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Vehicle Marketplace
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover your perfect vehicle from thousands of verified listings. 
                Compare prices, check MOT status, and connect directly with trusted sellers across the UK.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Marketplace Content */}
        <VehicleMarketplaceInteractive />
      </main>
    </div>
  );
}