'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'workshop' | 'admin';
  status: 'active' | 'suspended' | 'inactive';
  joinDate: string;
  listings: number;
  revenue: string;
}

type FilterRole = 'all' | 'buyer' | 'seller' | 'workshop' | 'admin';
type FilterStatus = 'all' | 'active' | 'suspended' | 'inactive';

export default function AdminUsersInteractive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'seller',
      status: 'active',
      joinDate: 'Jan 15, 2024',
      listings: 12,
      revenue: '$45,230',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: 'Feb 20, 2024',
      listings: 0,
      revenue: '-',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'workshop',
      status: 'active',
      joinDate: 'Dec 10, 2023',
      listings: 8,
      revenue: '$12,500',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'buyer',
      status: 'suspended',
      joinDate: 'Mar 5, 2024',
      listings: 0,
      revenue: '-',
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert@example.com',
      role: 'seller',
      status: 'inactive',
      joinDate: 'Nov 1, 2023',
      listings: 5,
      revenue: '$8,900',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserSelection = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'seller':
        return 'bg-success/10 text-success border-success/20';
      case 'workshop':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'suspended':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-muted';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">User Management</h2>
            <p className="text-sm text-muted-foreground">
              Total Users: {filteredUsers.length}
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2">
            <Icon name="UserPlusIcon" size={20} />
            Add User
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-background border-b border-border px-6 py-4 space-y-4 sticky top-16 z-10">
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
            onChange={(e) => setFilterRole(e.target.value as FilterRole)}
            className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="workshop">Workshop</option>
            <option value="admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-md">
            <span className="text-sm font-medium text-foreground">
              {selectedUsers.length} selected
            </span>
            <button className="px-3 py-1.5 text-sm bg-warning text-warning-foreground rounded-md hover:bg-warning/90 transition-colors duration-200 flex items-center gap-1">
              <Icon name="PauseIcon" size={16} />
              Suspend
            </button>
            <button className="px-3 py-1.5 text-sm bg-error text-error-foreground rounded-md hover:bg-error/90 transition-colors duration-200 flex items-center gap-1">
              <Icon name="TrashIcon" size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="p-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 border border-border rounded bg-input checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 border border-border rounded bg-input checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {user.revenue}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-md transition-colors duration-200">
                            <Icon
                              name="EyeIcon"
                              size={18}
                              className="text-muted-foreground hover:text-foreground"
                            />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-md transition-colors duration-200">
                            <Icon
                              name="EllipsisHorizontalIcon"
                              size={18}
                              className="text-muted-foreground hover:text-foreground"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Icon
                        name="UsersIcon"
                        size={32}
                        className="mx-auto mb-2 text-muted-foreground opacity-50"
                      />
                      <p className="text-muted-foreground">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {filteredUsers.length} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-md">
                1
              </button>
              <button className="px-3 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors duration-200">
                2
              </button>
              <button className="px-3 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
