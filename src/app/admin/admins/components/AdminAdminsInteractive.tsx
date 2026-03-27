//src/app/admin/admins/components/AdminAdminsInteractive.tsx
'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  permissions: string[];
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
}

export default function AdminAdminsInteractive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'super-admin'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const admins: Admin[] = [
    {
      id: 1,
      name: 'Super Admin',
      email: 'superadmin@ezybidder.com',
      role: 'super-admin',
      permissions: ['all'],
      status: 'active',
      joinDate: 'Jan 1, 2024',
      lastLogin: '2 hours ago',
    },
    {
      id: 2,
      name: 'John Administrator',
      email: 'john.admin@ezybidder.com',
      role: 'admin',
      permissions: [
        'manage_users',
        'manage_listings',
        'view_reports',
        'manage_auctions',
      ],
      status: 'active',
      joinDate: 'Feb 15, 2024',
      lastLogin: '30 minutes ago',
    },
    {
      id: 3,
      name: 'Sarah Support',
      email: 'sarah.support@ezybidder.com',
      role: 'admin',
      permissions: ['view_reports', 'support_users'],
      status: 'active',
      joinDate: 'Mar 10, 2024',
      lastLogin: '1 hour ago',
    },
    {
      id: 4,
      name: 'Mike Moderator',
      email: 'mike.mod@ezybidder.com',
      role: 'admin',
      permissions: ['manage_content', 'view_reports'],
      status: 'inactive',
      joinDate: 'Nov 20, 2023',
      lastLogin: '7 days ago',
    },
  ];

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const permissionsMap: Record<string, string> = {
    manage_users: 'Manage Users',
    manage_listings: 'Manage Listings',
    view_reports: 'View Reports',
    manage_auctions: 'Manage Auctions',
    manage_content: 'Manage Content',
    support_users: 'Support Users',
    all: 'All Permissions',
  };

  return (
    <div className="overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Admin Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Total Admins: {filteredAdmins.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
          >
            <Icon name="UserPlusIcon" size={20} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-background border-b border-border px-6 py-4 sticky top-16 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <Icon
              name="MagnifyingGlassIcon"
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as 'all' | 'admin' | 'super-admin')
            }
            className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Admins List */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">
                        {admin.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {admin.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            admin.role === 'super-admin'
                              ? 'bg-error/10 text-error border-error/20'
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}
                        >
                          {admin.role === 'super-admin'
                            ? 'Super Admin'
                            : 'Admin'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {admin.email}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="CalendarIcon" size={14} />
                          Joined {admin.joinDate}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            admin.status === 'active'
                              ? 'text-success'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <Icon name="CheckCircleIcon" size={14} />
                          Last login: {admin.lastLogin}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      admin.status === 'active'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Permissions */}
                <div className="mb-4 pb-4 border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Permissions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                      >
                        <Icon name="CheckIcon" size={12} className="mr-1" />
                        {permissionsMap[permission] || permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors duration-200 text-sm font-medium flex items-center gap-2">
                    <Icon name="PencilIcon" size={16} />
                    Edit
                  </button>
                  <button
                    disabled={admin.role === 'super-admin'}
                    className="px-4 py-2 border border-error/30 rounded-md text-error hover:bg-error/10 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Icon name="TrashIcon" size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon
                name="ShieldCheckIcon"
                size={32}
                className="mx-auto mb-2 text-muted-foreground opacity-50"
              />
              <p className="text-muted-foreground">No admins found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Admin</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors duration-200"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
