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
  orders: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a 4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  categories: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  offers: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a 2 2 0 0 1 0 2.828l-7 7a 2 2 0 0 1-2.828 0l-7-7A 1.994 1.994 0 0 1 3 12V7a 4 4 0 0 1 4-4z" /></svg>,
  analytics: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a 2 2 0 0 0-2-2H5a 2 2 0 0 0-2 2v6a 2 2 0 0 0 2 2h2a 2 2 0 0 0 2-2zm0 0V9a 2 2 0 0 1 2-2h2a 2 2 0 0 1 2 2v10m-6 0a 2 2 0 0 0 2 2h2a 2 2 0 0 0 2-2m0 0V5a 2 2 0 0 1 2-2h2a2 0 0 1 2 2v14a 2 2 0 0 1-2 2h-2a 2 2 0 0 1-2-2z" /></svg>,
  users: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a 4 4 0 1 1 0 5.292M15 21H3v-1a 6 6 0 0 1 12 0v1zm0 0h6v-1a 6 6 0 0 0-9-5.197M13 7a 4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /></svg>,
  activity: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  settings: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a 1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a 1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a 1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a 1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a 1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a 1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a 1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a 3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>,
  help: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a 9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
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
      <aside className="seller-sidebar">
        <div className="sidebar-branding mb-10 flex items-center gap-4 px-4 py-2">
          <div className="relative group cursor-pointer transition-all duration-500 hover:scale-110">
            <Logo size={42} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[26px] font-[1000] text-gray-900 tracking-[-0.04em] leading-none uppercase">
              Kokommerce
            </h1>
            <span className="block text-[10px] mt-2 text-[#eca840] tracking-[0.35em] font-black uppercase flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#eca840]/30"></span>
              ARTISANAL BAKERY
            </span>
          </div>
        </div>

        {/* Connection Visualizer: Profile Card */}
        <div className="mb-8 px-5 py-6 bg-white rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform border border-gray-50 bg-gray-50">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-black text-gray-900 truncate">{profileName}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isOnline ? 'bg-green-500 shadow-sm shadow-green-400' : 'bg-gray-300'}`}></div>
              <p className={`text-[9px] font-bold uppercase tracking-widest truncate ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>{statusText}</p>
            </div>
          </div>
        </div>

        <Link href="/?view_as=seller" className="mb-8 block w-full py-4 text-center text-[11px] font-black text-[#eca840] border-2 border-[#eca840]/20 rounded-2xl hover:bg-[#eca840] hover:text-white hover:border-[#eca840] transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] leading-none shadow-sm hover:shadow-md">
          View Storefront
        </Link>

        <nav className="sidebar-nav space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-item group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${url.startsWith(item.href) ? 'bg-[#2d2a26] text-white shadow-xl shadow-gray-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <div className={`w-5 h-5 transition-colors ${url.startsWith(item.href) ? 'text-[#eca840]' : 'text-gray-400 group-hover:text-gray-900'}`}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="seller-main flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="seller-header flex justify-between items-center mb-12 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-sm sticky top-0 z-[100]">
          <div className="header-search flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl w-full max-w-md group focus-within:bg-white focus-within:shadow-lg transition-all border border-transparent focus-within:border-gray-100">
            <svg className="w-5 h-5 text-gray-300 group-focus-within:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search bakery analytics..." className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 placeholder:text-gray-300 w-full" />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 border-r border-gray-100 pr-8">
              <div className="relative">
                <button
                  id="notification-bell"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#eca840] hover:bg-white hover:border-gray-100 transition-all shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {(notifications.low_stock.length + (notifications.recent?.length || 0)) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-md">
                      {notifications.low_stock.length + (notifications.recent?.length || 0)}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-6 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[999] p-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Inventory Alerts</h4>
                      <span className="text-[9px] font-bold text-[#eca840] px-2 py-0.5 bg-orange-50 rounded-full">{notifications.low_stock.length} Active</span>
                    </div>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {(notifications.low_stock.length === 0 && (!notifications.recent || notifications.recent.length === 0)) ? (
                          <div className="text-center py-8">
                            <p className="text-[10px] text-gray-300 font-black uppercase">Pantry is full</p>
                          </div>
                        ) : (
                          <>
                            {notifications.recent?.map((notif: any) => (
                              <div key={`recent-${notif.id}`} className="p-4 bg-orange-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-[#eca840]/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#eca840]"></div>
                                  <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{notif.title}</h5>
                                </div>
                                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">{notif.message}</p>
                              </div>
                            ))}
                            {notifications.low_stock.map((item: any) => (
                              <div key={`low-${item.id}`} className="p-4 bg-red-50/30 rounded-2xl hover:bg-white border border-transparent hover:border-red-100 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                  <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Low Stock Alert</h5>
                                </div>
                                <h5 className="text-xs font-black text-gray-800">{item.name}</h5>
                                <p className="text-[10px] text-red-400 font-bold mt-1">Stock Left: {item.stock}</p>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pl-4">
              <div className="relative bg-white border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-2.5 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                {/* The Custom UI visible to the user */}
                <div className="text-left">
                  <h5 className="text-sm font-black text-gray-900 leading-none mb-1">{profileName.split(' ')[0]}</h5>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">{isOnline ? 'CONNECTED' : 'OFFLINE'}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full p-[2px] transition-all duration-500 ${isOnline ? 'bg-gradient-to-tr from-blue-500 to-indigo-600' : 'bg-gray-200'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-100 flex items-center justify-center">
                      {profileImage ? (
                        <img src={profileImage} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-black text-gray-400">{profileName.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Overlaid Clerk UserButton - hidden but clickable over the entire container */}
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
          </div>
        </header>

        <section className="seller-content animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </section>

        <footer className="mt-20 py-8 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] border-t border-gray-100">
          © 2024 Kokommerce Artisanal Admin • Empowering Your Craft
        </footer>
      </main>
    </div>
  );
};

export default SellerLayout;
