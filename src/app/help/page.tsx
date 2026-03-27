import Header from '@/components/common/Header';
import BreadcrumbNavigation from '@/components/common/BreadcrumbNavigation';
import HelpCenterClient from './components/HelpCenterClient';

export const metadata = {
  title: 'Help & Support - EzyBidder',
  description: 'Get help, find answers, or contact EzyBidder support team.',
};

export default function HelpPage() {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Help & Support', path: '/help' },
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <HelpCenterClient />
        </div>
      </main>
    </div>
  );
}
