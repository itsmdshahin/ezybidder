// src/app/admin/page.tsx

import type { Metadata } from 'next';
import AdminLayout from './layout/AdminLayout';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';

export const metadata: Metadata = {
  title: 'Admin Dashboard - EzyBidder',
  description: 'Administrative dashboard for managing users, auctions, and platform settings.',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <main className="flex-1 overflow-auto">
        <AdminDashboardInteractive />
      </main>
    </AdminLayout>
  );
}
