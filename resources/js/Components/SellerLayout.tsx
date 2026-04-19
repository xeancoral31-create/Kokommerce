import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';

import Logo from './Logo';

const icons = {
  dashboard: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  orders: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  categories: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  offers: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  analytics: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 0 002 2h2a2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  activity: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  settings: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  help: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { url, props } = usePage();
  const notifications = (props.seller_notifications as any) || { low_stock: [] };
  const initialStore = (props.store_profile as any) || { name: 'Julian Hearth', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', tagline: 'Master Baker' };
  const [store, setStore] = React.useState(initialStore);


  const [showNotifications, setShowNotifications] = React.useState(false);

  // Sync with real-time profile changes from Settings (Image 2 & 3)
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
    <div className="seller-module">
      <aside className="seller-sidebar">
        <div className="sidebar-branding mb-12 flex items-center gap-4 px-2">
          <div className="relative group cursor-pointer transform hover:rotate-6 transition-transform duration-500">
            <Logo size={48} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter leading-none uppercase">
              {store.name.split(' ')[0]}
            </h1>
            <span className="block text-[8px] mt-1 text-[#eca840] tracking-[0.4em] font-black uppercase">ARTISANAL BAKERY</span>
          </div>
        </div>
        
        <div className="mb-10 px-4 py-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-xl hover:shadow-gray-500/5 transition-all">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-gray-100 bg-white">
            <img src={store.image} alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-gray-900 truncate max-w-[120px]">{store.name}</h4>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5 truncate max-w-[120px]">{store.tagline || 'Master Baker'}</p>
          </div>
        </div>

        <Link href="/" className="mb-12 block w-full py-4 text-center text-[10px] font-black text-[#eca840] border-2 border-[#eca840] rounded-2xl hover:bg-[#eca840] hover:text-white hover:shadow-lg hover:shadow-[#eca840]/30 transition-all uppercase tracking-[0.2em] leading-none">
            View Storefront
        </Link>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`nav-item ${url.startsWith(item.href) ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="seller-main">
        <header className="seller-header">
          <div className="header-search group">
            <svg className="w-5 h-5 text-gray-300 group-focus-within:text-[#f5a623] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search orders, products, or analytics..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 placeholder:text-gray-300" />
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4 border-r border-gray-100 pr-10">
               <div className="relative">
                  <button 
                    id="notification-bell"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#f5a623] hover:bg-white hover:shadow-xl transition-all group border border-transparent hover:border-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {notifications.low_stock.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce shadow-lg shadow-red-500/30">
                        {notifications.low_stock.length}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-6 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-[999] p-8 animate-in fade-in slide-in-from-top-6 duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Store Notifications</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{notifications.low_stock.length} Alerts</span>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                        {notifications.low_stock.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No active alerts</p>
                            <p className="text-[11px] text-gray-300 font-medium mt-1">Everything is running smoothly.</p>
                          </div>
                        ) : (
                          notifications.low_stock.map((item: any) => (
                            <div key={item.id} className="p-5 bg-red-50 rounded-3xl border border-red-100 group hover:bg-white hover:border-red-200 transition-all cursor-pointer">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Low Stock Alert</p>
                              </div>
                              <h5 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors">{item.name}</h5>
                              <p className="text-[11px] text-gray-400 font-bold mt-1.5 flex justify-between">
                                Current Inventory: <span className="text-red-600 underline font-black">{item.stock} units</span>
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.low_stock.length > 0 && (
                        <button className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all">
                          Update All Inventory
                        </button>
                      )}
                    </div>
                  )}
               </div>
               <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#f5a623] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </button>
            </div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-xs truncate max-w-[100px]">{store.tagline || 'Bakery Admin'}</p>
                <h5 className="text-sm font-black text-gray-900 leading-none truncate max-w-[100px]">{store.name}</h5>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#eca840] p-0.5 shadow-lg shadow-[#eca840]/20 transform group-hover:rotate-6 transition-transform">
                <div className="w-full h-full rounded-[0.9rem] overflow-hidden border-2 border-white/20 bg-white">
                   <img src={store.image} alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>


        <section className="seller-content">
          {children}
        </section>

        <footer className="py-8 text-center text-xs text-gray-400 font-medium">
             © 2024 Kokommerce Artisanal Admin. Designed for Master Bakers.
        </footer>
      </main>
    </div>
  );
};

export default SellerLayout;
