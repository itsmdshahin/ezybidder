import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import ServiceBookingInteractive from './components/ServiceBookingInteractive';

export const metadata: Metadata = {
  title: 'Service Booking - EzyBidder',
  description: 'Schedule automotive services with trusted workshops. Book denting, painting, servicing, and accessories with integrated calendar management and AI-powered damage assessment.',
};

export default function ServiceBookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BreadcrumbNavigation />
          
          <div className="mt-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Service Booking</h1>
              <p className="text-muted-foreground">
                Schedule professional automotive services with trusted workshops across the UK
              </p>
            </div>
            
            <ServiceBookingInteractive />
          </div>
        </div>
      </main>
    </div>
  );
}