// src/app/profile/page.tsx
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import ProfileClient from './components/ProfileClient';

export const metadata: Metadata = {
  title: 'Profile - EzyBidder',
  description: 'Your account profile, settings and activity.'
};

export default function ProfilePage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' },
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
          <ProfileClient />
        </div>
      </main>
    </div>
  );
}
