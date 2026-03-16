import type { Metadata } from 'next';
import AdminLayout from '../layout/AdminLayout';
import AdminAdminsInteractive from './components/AdminAdminsInteractive';

export const metadata: Metadata = {
  title: 'Admin Management - EzyBidder Admin',
  description: 'Manage admin accounts and super admin roles.',
};

export default function AdminAdminsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 overflow-auto">
        <AdminAdminsInteractive />
      </main>
    </AdminLayout>
  );
}
