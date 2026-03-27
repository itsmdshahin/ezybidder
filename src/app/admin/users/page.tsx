// src/app/admin/users/page.tsx

import type { Metadata } from 'next';
import AdminLayout from '../layout/AdminLayout';
import AdminUsersInteractive from './components/AdminUsersInteractive';

export const metadata: Metadata = {
  title: 'User Management - EzyBidder Admin',
  description: 'Manage platform users, roles, and permissions.',
};

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <main className="flex-1 overflow-auto">
        <AdminUsersInteractive />
      </main>
    </AdminLayout>
  );
}
