import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import Logo from './Logo';

const icons = {
  dashboard: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  ),
  products: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  orders: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  categories: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  offers: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  analytics: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 0 012 2v14a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 0 01-2 2h-2a2 0 01-2-2z" /></svg>,
  users: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  activity: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  settings: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  help: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { url, props } = usePage();
  const { user, isLoaded } = useUser();
  const authUser = (props.auth_user as any) || null; // Laravel-authenticated user (reliable fallback)
  const notifications = (props.seller_notifications as any) || { low_stock: [] };
  const initialStore = (props.store_profile as any) || {
    name: 'Kokommerce Artisanal',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    tagline: 'Handcrafted Joy In Every Bite'
  };
  const [store, setStore] = React.useState(initialStore);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);

  // Identity priority logic: Clerk first → Laravel auth_user → store defaults
  const clerkImage = isLoaded && user?.imageUrl ? user.imageUrl : null;
  const profileImage = clerkImage || authUser?.image || store.image || 'https://via.placeholder.com/100?text=Logo';
  const profileName = (isLoaded && user?.fullName)
    ? user.fullName
    : (authUser?.name || store.name || 'Kokommerce');

  // Online if: Clerk user loaded OR Laravel session exists
  const isOnline = (isLoaded && !!user) || !!authUser?.online;
  const statusText = !isLoaded && !authUser ? 'Connecting...' : isOnline ? 'Online' : 'Offline';


  // Sync with real-time profile changes from Settings
  React.useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail?.image) setStore((prev: any) => ({ ...prev, image: e.detail.image }));
      if (e.detail?.name) setStore((prev: any) => ({ ...prev, name: e.detail.name }));
    };
    window.addEventListener('artisanal_profile_sync', handleSync);
    return () => window.removeEventListener('artisanal_profile_sync', handleSync);
  }, []);

  // Update when Inertia props change (after save)
  React.useEffect(() => {
    if (props.store_profile) setStore(props.store_profile as any);
  }, [props.store_profile]);

  const navItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: icons.dashboard },
    { label: 'Products', href: '/seller/products', icon: icons.products },
    { label: 'Orders', href: '/seller/orders', icon: icons.orders },
    { label: 'Categories', href: '/seller/categories', icon: icons.categories },
    { label: 'Offers', href: '/seller/offers', icon: icons.offers },
    { label: 'Analytics', href: '/seller/analytics', icon: icons.analytics },
    { label: 'Users', href: '/seller/users', icon: icons.users },
    { label: 'Activity', href: '/seller/activity', icon: icons.activity },
    { label: 'Settings', href: '/seller/settings', icon: icons.settings },
    { label: 'Help', href: '/seller/help', icon: icons.help },
  ];

  return (
    <div className="seller-module min-h-screen bg-[#fcfaf7]">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`seller-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-branding mb-8 flex items-center gap-3 px-3 py-1">
          <div className="relative group cursor-pointer transition-all duration-500 hover:scale-105">
            <Logo size={36} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[22px] font-black text-gray-900 tracking-[-0.04em] leading-none uppercase">
              Kokommerce
            </h1>
            <span className="block text-[8px] mt-1.5 text-[#eca840] tracking-[0.3em] font-black uppercase flex items-center gap-2">
              <span className="w-3 h-[1px] bg-[#eca840]/30"></span>
              ARTISANAL UNIT
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-[#eca840]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Professional Profile Summary */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 group cursor-pointer p-3 rounded-[1.5rem] hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-black text-gray-900 truncate tracking-tight">{profileName}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1 h-1 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`}></div>
                <p className={`text-[7px] font-black uppercase tracking-[0.1em] ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>{statusText}</p>
              </div>
            </div>
          </div>
        </div>

        <Link href="/?view_as=seller" className="mb-8 block w-full py-3.5 text-center text-[9px] font-black text-[#eca840] border border-[#eca840]/20 rounded-xl hover:bg-orange-50 hover:border-[#eca840]/40 transition-all active:scale-95 uppercase tracking-[0.25em] leading-none bg-white shadow-sm">
          View Storefront
        </Link>

        <nav className="sidebar-nav space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`nav-item group flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 ${url.startsWith(item.href) ? 'bg-[#2d2a26] text-white shadow-lg shadow-gray-900/10' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className={`w-4.5 h-4.5 transition-colors ${url.startsWith(item.href) ? 'text-[#eca840]' : 'text-gray-300 group-hover:text-gray-900'}`}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="seller-main flex-1 overflow-y-auto">
        <header className="seller-header flex items-center gap-4 lg:gap-8 mb-6 lg:mb-10 bg-white/95 backdrop-blur-2xl px-6 lg:px-10 py-3 lg:py-4.5 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] sticky top-2 lg:top-6 z-[100] mx-4 lg:mx-6 transition-all duration-500">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-[#eca840] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <div className="flex-1 hidden sm:flex items-center">
            <div className="header-search flex-1 flex items-center gap-4 bg-gray-50/50 backdrop-blur-md px-6 py-3 rounded-xl border border-gray-100 focus-within:bg-white focus-within:shadow-lg focus-within:border-[#eca840]/20 transition-all duration-500 group">
              <svg className="w-4 h-4 text-gray-300 group-focus-within:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search across your artisanal inventory..."
                className="bg-transparent border-none focus:ring-0 text-[11px] font-bold text-gray-700 placeholder:text-gray-300 w-full uppercase tracking-[0.2em]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 ml-auto">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#eca840] hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {(notifications.low_stock.length + (notifications.recent?.length || 0)) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-md">
                    {notifications.low_stock.length + (notifications.recent?.length || 0)}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-6 w-[360px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-4">
                  {/* Panel Header with Mark All as Read */}
                  <div className="px-6 pt-6 pb-4 border-b border-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Notifications</h4>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {notifications.low_stock.length + (notifications.recent?.length || 0)} Active
                        </p>
                      </div>
                      <button
                        id="mark-all-read-btn"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                            await fetch('/seller/notifications/read-all', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': token || '',
                                'Accept': 'application/json',
                              },
                            });
                            window.location.reload();
                          } catch (err) {
                            console.error('Failed to mark all as read:', err);
                          }
                        }}
                        className="text-[9px] font-black text-[#eca840] uppercase tracking-widest px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-[#eca840] hover:text-white transition-all duration-300 active:scale-95 border border-[#eca840]/20 hover:border-[#eca840]"
                      >
                        Mark All Read
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                    {(notifications.low_stock.length === 0 && (!notifications.recent || notifications.recent.length === 0)) ? (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-5 h-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">All Caught Up</p>
                        <p className="text-[9px] text-gray-200 font-medium mt-1">No pending notifications</p>
                      </div>
                    ) : (
                      <>
                        {notifications.recent?.map((notif: any) => (
                          <button
                            key={`recent-${notif.id}`}
                            onClick={() => {
                              setSelectedNotification(notif);
                              setShowNotifications(false);
                            }}
                            className="w-full text-left p-4 bg-orange-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-[#eca840]/20 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                <div className="w-8 h-8 rounded-xl bg-[#eca840]/10 flex items-center justify-center">
                                  {notif.type === 'order' ? (
                                    <svg className="w-3.5 h-3.5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                  ) : notif.type === 'promo' ? (
                                    <svg className="w-3.5 h-3.5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                  ) : (
                                    <svg className="w-3.5 h-3.5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#eca840] flex-shrink-0"></div>
                                  <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">{notif.title}</h5>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{notif.message}</p>
                                {notif.created_at && (
                                  <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest mt-2">
                                    {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                )}
                              </div>
                              <svg className="w-3 h-3 text-gray-200 group-hover:text-[#eca840] transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        ))}
                        {notifications.low_stock.map((item: any) => (
                          <button
                            key={`low-${item.id}`}
                            onClick={() => {
                              setSelectedNotification({
                                id: `low_stock_${item.id}`,
                                type: 'system',
                                title: 'Low Stock Alert',
                                message: `"${item.name}" is running critically low with only ${item.stock} unit(s) remaining. Consider restocking this item to avoid missed sales opportunities.`,
                                created_at: new Date().toISOString(),
                                data: { product_name: item.name, stock: item.stock }
                              });
                              setShowNotifications(false);
                            }}
                            className="w-full text-left p-4 bg-red-50/30 rounded-2xl hover:bg-white border border-transparent hover:border-red-100 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                                  <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Low Stock Alert</h5>
                                </div>
                                <h5 className="text-xs font-black text-gray-800 truncate">{item.name}</h5>
                                <p className="text-[10px] text-red-400 font-bold mt-1">Stock Left: {item.stock}</p>
                              </div>
                              <svg className="w-3 h-3 text-gray-200 group-hover:text-red-400 transition-colors flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative bg-[#2d2a26] border border-[#2d2a26] rounded-xl px-3 lg:px-5 py-2 lg:py-2.5 flex items-center gap-3 lg:gap-4 hover:opacity-95 transition-all cursor-pointer group shadow-md shadow-gray-200/50">
              <div className="text-left hidden lg:block">
                <h5 className="text-[10px] font-black text-white leading-none mb-1.5 uppercase tracking-wide">{profileName.split(' ')[0]}</h5>
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] font-black text-[#eca840] uppercase tracking-[0.2em]">{isOnline ? 'CONNECTED' : 'OFFLINE'}</span>
                </div>
              </div>

              <div className="relative">
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full p-[1.5px] transition-all duration-500 ${isOnline ? 'bg-[#eca840]' : 'bg-gray-400'}`}>
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#2d2a26] bg-gray-100 flex items-center justify-center">
                    {profileImage ? (
                      <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-gray-400">{profileName.charAt(0)}</span>
                    )}
                  </div>
                </div>
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-green-500 rounded-full border-2 border-[#2d2a26]"></div>
                )}
              </div>

              {/* Overlaid Clerk UserButton */}
              <div className="absolute inset-0 opacity-0 z-10 cursor-pointer [&_button]:w-full [&_button]:h-full [&_button]:rounded-full">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonTrigger: "w-full h-full",
                      rootBox: "w-full h-full"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="seller-content animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </section>

        <footer className="mt-20 py-8 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] border-t border-gray-100">
          © 2024 Kokommerce Artisanal Admin • Empowering Your Craft
        </footer>
      </main>

      {/* ── Notification Detail Modal ── */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedNotification(null)}></div>
          <div className="relative bg-white w-full max-w-[520px] rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className={`px-8 pt-8 pb-6 border-b border-gray-50 ${
              selectedNotification.type === 'order' ? 'bg-gradient-to-r from-orange-50 to-white' :
              selectedNotification.type === 'promo' ? 'bg-gradient-to-r from-amber-50 to-white' :
              selectedNotification.type === 'system' ? 'bg-gradient-to-r from-red-50 to-white' :
              'bg-gradient-to-r from-blue-50 to-white'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    selectedNotification.type === 'order' ? 'bg-[#eca840]/10' :
                    selectedNotification.type === 'promo' ? 'bg-amber-100' :
                    selectedNotification.type === 'system' ? 'bg-red-50' :
                    'bg-blue-50'
                  }`}>
                    {selectedNotification.type === 'order' ? (
                      <svg className="w-5 h-5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    ) : selectedNotification.type === 'promo' ? (
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    ) : selectedNotification.type === 'system' ? (
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${
                      selectedNotification.type === 'order' ? 'text-[#eca840]' :
                      selectedNotification.type === 'promo' ? 'text-amber-500' :
                      selectedNotification.type === 'system' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {selectedNotification.type === 'order' ? 'Order Notification' :
                       selectedNotification.type === 'promo' ? 'Promotion Alert' :
                       selectedNotification.type === 'system' ? 'System Alert' :
                       'Notification'}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1 leading-tight">{selectedNotification.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-300 hover:text-gray-900 bg-white/80 hover:bg-gray-100 rounded-xl p-2 transition-all active:scale-90"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {selectedNotification.message}
              </p>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                {selectedNotification.created_at && (
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Received</p>
                    <p className="text-xs font-bold text-gray-700">
                      {new Date(selectedNotification.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Type</p>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                    selectedNotification.type === 'order' ? 'bg-orange-50 text-[#eca840]' :
                    selectedNotification.type === 'promo' ? 'bg-amber-50 text-amber-600' :
                    selectedNotification.type === 'system' ? 'bg-red-50 text-red-400' :
                    'bg-blue-50 text-blue-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      selectedNotification.type === 'order' ? 'bg-[#eca840]' :
                      selectedNotification.type === 'promo' ? 'bg-amber-500' :
                      selectedNotification.type === 'system' ? 'bg-red-400' :
                      'bg-blue-500'
                    }`}></div>
                    {selectedNotification.type}
                  </span>
                </div>
              </div>

              {/* Extra data (e.g. for low stock) */}
              {selectedNotification.data && (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Details</p>
                  <div className="space-y-2">
                    {Object.entries(selectedNotification.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-black text-gray-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8 flex gap-3">
              {selectedNotification.id && !String(selectedNotification.id).startsWith('low_stock_') && (
                <button
                  onClick={async () => {
                    try {
                      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                      await fetch(`/seller/notifications/${selectedNotification.id}/read`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-CSRF-TOKEN': token || '',
                          'Accept': 'application/json',
                        },
                      });
                      setSelectedNotification(null);
                      window.location.reload();
                    } catch (err) {
                      console.error('Failed to mark as read:', err);
                    }
                  }}
                  className="flex-1 py-4 bg-[#eca840] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d2a26] transition-all active:scale-95 shadow-lg shadow-orange-200/50"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedNotification(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerLayout;
