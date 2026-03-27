// src/app/admin/layout/AdminLayout.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/admin', icon: 'SquaresPlusIcon' },
    { label: 'Users', href: '/admin/users', icon: 'UsersIcon', badge: 1250 },
    { label: 'Admins', href: '/admin/admins', icon: 'ShieldCheckIcon' },
    { label: 'Auctions', href: '/admin/auctions', icon: 'FireIcon' },
    { label: 'Listings', href: '/admin/listings', icon: 'CheckIcon' },
    { label: 'Reports', href: '/admin/reports', icon: 'FlagIcon' },
    { label: 'Analytics', href: '/admin/analytics', icon: 'ChartBarIcon' },
    { label: 'Settings', href: '/admin/settings', icon: 'Cog6ToothIcon' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed left-0 top-0 w-64 h-screen bg-card border-r border-border shadow-lg transition-transform duration-300 ease-in-out z-40 md:translate-x-0 md:static md:shadow-none`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">EB</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground">EzyBidder</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden p-1 hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors duration-200">
            <Icon name="QuestionMarkCircleIcon" size={20} />
            Help & Support
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors duration-200">
            <Icon name="ArrowLeftOnRectangleIcon" size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-muted rounded-md transition-colors duration-200"
              >
                <Icon name="Bars3Icon" size={24} />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {sidebarItems.find(item => isActive(item.href))?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Super Admin
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden sm:block relative w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
                <Icon
                  name="MagnifyingGlassIcon"
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-muted rounded-md transition-colors duration-200 relative">
                <Icon name="BellIcon" size={20} className="text-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">SA</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-foreground">Admin</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                  </div>
                  <Icon
                    name="ChevronDownIcon"
                    size={16}
                    className={`hidden sm:block text-muted-foreground transition-transform duration-200 ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center gap-2">
                      <Icon name="UserIcon" size={16} />
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center gap-2">
                      <Icon name="Cog6ToothIcon" size={16} />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center gap-2">
                      <Icon name="ArrowLeftOnRectangleIcon" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
