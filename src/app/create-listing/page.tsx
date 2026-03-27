// src/app/create-listing/page.tsx
'use client';

import CreateListingForm from '@/app/my-listings/components/CreateListingForm';
import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';

export default function CreateListingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation className="mb-6" />
          <CreateListingForm />
        </div>
      </main>
    </div>
  );
}
