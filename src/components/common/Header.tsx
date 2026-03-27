'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

interface HeaderProps {
  className?: string;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

/* ---------------- SearchBar ---------------- */
const SearchBar = ({
  onSearch,
  placeholder = 'Search vehicles...',
}: {
  onSearch: (q: string) => void;
  placeholder?: string;
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div
          className={`relative transition-all duration-300 ${isExpanded ? 'w-80' : 'w-64'
            } hidden md:block`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
          />
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((s) => !s)}
          className="md:hidden p-2 hover:bg-muted rounded-md transition-colors duration-200"
          aria-label="Toggle search"
        >
          <Icon
            name="MagnifyingGlassIcon"
            size={24}
            className="text-foreground"
          />
        </button>
      </form>
    </div>
  );
};

/* ---------------- NotificationCenter ---------------- */

interface Notification {
  id: string;
  user_id: string;
  type: 'auction' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  action_url: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  read: boolean | null;
  created_at: string;
}

const NotificationCenter = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 load notifications once (mount এ)
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          setNotifications([]);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/notifications', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const json = await res.json().catch(() => null);

        if (res.ok && Array.isArray(json)) {
          setNotifications(json);
        } else {
          console.error('[NotificationCenter] load error:', json);
        }
      } catch (err) {
        console.error('[NotificationCenter] fatal load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // 🔹 realtime: listen for new notifications for this user
  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initRealtime = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user || !active) return;

      channel = supabase
        .channel(`notifications:user:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            setNotifications((prev) => [
              payload.new as Notification,
              ...prev,
            ]);
          }
        )
        .subscribe();
    };

    void initRealtime();

    return () => {
      active = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // 🔹 mark all as read when dropdown opens
  useEffect(() => {
    const markAllRead = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) return;

        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ all: true }),
        });

        // UI state update
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      } catch (err) {
        console.error('[NotificationCenter] markAllRead error:', err);
      }
    };

    if (isOpen) {
      void markAllRead();
    }
  }, [isOpen]);

  // 🔹 close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="relative p-2 hover:bg-muted rounded-md transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Icon name="BellIcon" size={24} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-md shadow-lg z-50 animate-slide-in">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-popover-foreground">
              Notifications
            </h3>
            {loading && (
              <span className="text-[11px] text-muted-foreground">
                Loading…
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => {
                const time = new Date(
                  n.created_at
                ).toLocaleString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                });

                const Wrapper = n.action_url ? Link : 'div';
                const wrapperProps = n.action_url
                  ? { href: n.action_url }
                  : ({} as any);

                const iconName =
                  n.type === 'auction'
                    ? 'ClockIcon'
                    : n.type === 'message'
                      ? 'ChatBubbleLeftIcon'
                      : n.type === 'payment'
                        ? 'BanknotesIcon'
                        : 'InformationCircleIcon';

                return (
                  <Wrapper
                    key={n.id}
                    {...wrapperProps}
                    className={`block p-4 border-b border-border last:border-b-0 hover:bg-muted transition-colors duration-200 ${!n.read ? 'bg-muted/60' : 'bg-popover'
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon
                          name={iconName}
                          size={20}
                          className="text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-popover-foreground">
                          {n.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {time}
                        </p>
                      </div>
                    </div>
                  </Wrapper>
                );
              })
            ) : (
              !loading && (
                <div className="p-8 text-center">
                  <Icon
                    name="BellIcon"
                    size={48}
                    className="text-muted-foreground mx-auto mb-4"
                  />
                  <p className="text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              )
            )}
          </div>
          <div className="p-4 border-t border-border">
            <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors duration-200">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



/* ---------------- UserAccountMenu ---------------- */
const UserAccountMenu = ({
  isOpen,
  onToggle,
  displayName,
  email,
  onSignOut,
}: {
  isOpen: boolean;
  onToggle: () => void;
  displayName?: string | null;
  email?: string | null;
  onSignOut: () => Promise<void>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const userMenuItems = [
    { label: 'Profile Settings', icon: 'UserIcon', path: '/profile' },
    { label: 'My Listings', icon: 'RectangleStackIcon', path: '/my-listings' },
    { label: 'Bid History', icon: 'ClockIcon', path: '/bid-history' },
    { label: 'Messages', icon: 'ChatBubbleLeftIcon', path: '/chat' },
    { label: 'Workshop Settings', icon: 'CogIcon', path: '/workshop-settings' },
    { label: 'Help & Support', icon: 'QuestionMarkCircleIcon', path: '/help' },
  ];

  const initials = (displayName || email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
          {initials}
        </div>
        <Icon name="ChevronDownIcon" size={16} className="text-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-popover border border-border rounded-md shadow-lg z-50 animate-slide-in">
          <div className="p-4 border-b border-border">
            <p className="font-medium text-popover-foreground">
              {displayName ?? 'User'}
            </p>
            {email && (
              <p className="text-sm text-muted-foreground">{email}</p>
            )}
          </div>

          <div className="py-2">
            {userMenuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                onClick={onToggle}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  className="text-muted-foreground"
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={async () => {
                await onSignOut();
                onToggle();
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
            >
              <Icon
                name="ArrowRightOnRectangleIcon"
                size={16}
                className="text-error"
              />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Header (main) ---------------- */
const Header = ({ className = '' }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // user info
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    { label: 'Marketplace', path: '/vehicle-marketplace', icon: 'HomeIcon' },
    { label: 'Live Auction', path: '/live-auction', icon: 'FireIcon' },
    {
      label: 'Services',
      path: '/service-booking',
      icon: 'WrenchScrewdriverIcon',
    },
    { label: 'Dashboard', path: '/user-dashboard', icon: 'ChartBarIcon' },
  ];

  useEffect(() => {
    let mounted = true;

    // restore from sessionStorage quickly (if present)
    try {
      const rawUser =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('user')
          : null;
      if (rawUser && mounted) {
        const parsed = JSON.parse(rawUser);
        setUserId(parsed.id ?? null);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.firstName || parsed.lastName)
          setDisplayName(
            `${parsed.firstName ?? ''} ${parsed.lastName ?? ''}`.trim() ||
            null
          );
      }
    } catch (err) {
      // ignore parse errors
    }

    // helper to populate states from Supabase user & profile
    const populateFromSupabase = async (u?: any) => {
      if (!mounted) return;
      const user = u ?? (await supabase.auth.getUser()).data?.user;
      if (user) {
        setUserId(user.id ?? null);
        setEmail(user.email ?? null);

        // try to fetch profile row (optional)
        try {
          const { data: profile, error: pErr } = await supabase
            .from('profiles')
            .select('first_name,last_name,full_name,email')
            .eq('id', user.id)
            .limit(1)
            .single();

          if (!pErr && profile) {
            const name = (
              profile.full_name ||
              `${profile.first_name || ''} ${profile.last_name || ''}`
            ).trim();
            if (name) setDisplayName(name);
            if (profile.email) setEmail(profile.email);
            // save a minimal user object to sessionStorage for speed
            sessionStorage.setItem(
              'user',
              JSON.stringify({
                id: user.id,
                email: profile.email ?? user.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
              })
            );
          } else {
            // fallback to user data only
            sessionStorage.setItem(
              'user',
              JSON.stringify({ id: user.id, email: user.email })
            );
          }
        } catch (err) {
          // ignore profile fetch error
          sessionStorage.setItem(
            'user',
            JSON.stringify({ id: user.id, email: user.email })
          );
        }
      } else {
        // no user: clear state & storage
        setUserId(null);
        setDisplayName(null);
        setEmail(null);
        sessionStorage.removeItem('user');
      }
    };

    // initial populate
    populateFromSupabase();

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        populateFromSupabase(u);
      }
    );

    return () => {
      mounted = false;
      if (listener?.subscription)
        listener.subscription.unsubscribe?.();
      if ((listener as any)?.unsubscribe)
        (listener as any).unsubscribe();
    };
  }, []);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // e.g. router.push(`/vehicle-marketplace?query=${encodeURIComponent(query)}`)
  };

  const isActiveRoute = (path: string) =>
    typeof pathname === 'string' && pathname === path;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error', err);
    } finally {
      sessionStorage.removeItem('supabase_session');
      sessionStorage.removeItem('user');
      setUserId(null);
      setDisplayName(null);
      setEmail(null);
      // keep layout intact then navigate home
      router.push('/');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-background border-b border-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Image
                src="/assets/images/ezybidder.png"
                alt="EzyBidder Logo"
                width={32}
                height={32}
                priority
              />

              <Icon
                name="TruckIcon"
                size={20}
                className="text-primary-foreground"
              />
            </div>
            <span className="text-xl font-semibold text-foreground">
              EzyBidder
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
                  }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search + actions */}
          <div className="flex items-center space-x-4">
            <SearchBar onSearch={handleSearch} />

            <NotificationCenter
              isOpen={isNotificationOpen}
              onToggle={() => setIsNotificationOpen((s) => !s)}
            />

            {/* If user logged in -> show account menu, otherwise show Sign in / Sign up */}
            {userId ? (
              <UserAccountMenu
                isOpen={isUserMenuOpen}
                onToggle={() => setIsUserMenuOpen((s) => !s)}
                displayName={displayName}
                email={email}
                onSignOut={handleSignOut}
              />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1 border rounded text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 border rounded text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              className="md:hidden p-2 hover:bg-muted rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Icon
                name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                size={24}
                className="text-foreground"
              />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Icon
                  name="MagnifyingGlassIcon"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>

              {/* Mobile auth buttons (when not logged in) */}
              {!userId && (
                <div className="mt-3 flex space-x-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-3 py-2 border rounded text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center px-3 py-2 border rounded text-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile account quick actions (when logged in) */}
              {userId && (
                <div className="mt-3">
                  <Link
                    href="/my-listings"
                    className="block px-3 py-2 rounded text-sm hover:bg-muted"
                  >
                    My Listings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 w-full px-3 py-2 rounded border text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
