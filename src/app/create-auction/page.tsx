// app/auctions/create-auction/page.tsx

import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import CreateAuctionForm from '@/app/live-auction/components/CreateAuctionForm';

export default function CreateAuctionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation className="mb-6" />
          <CreateAuctionForm />
        </div>
      </main>
    </div>
  );
}
