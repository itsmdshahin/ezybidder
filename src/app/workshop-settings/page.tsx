import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import WorkshopSettingsForm from './components/WorkshopSettingsForm';

export const metadata: Metadata = {
  title: 'Workshop Settings - EzyBidder',
  description: 'Manage your workshop business profile, timings and offerings.',
};

export default function WorkshopSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation className="mb-6" />
          <WorkshopSettingsForm />
        </div>
      </main>
    </div>
  );
}
