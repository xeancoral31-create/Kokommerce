import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

interface DashboardProps {
  stats: {
    total_revenue: number;
    today_revenue: number;
    active_orders: number;
    low_stock_alerts: number;
    new_customers: number;
    today_signups: number;
    pre_order_count: number;
  };
  recent_sales: Array<{ day: string; value: number; orders: number; revenue: number }>;
  hourly_activity: number[];
  top_products: any[];
  urgent_orders: any[];
  activity_logs: any[];
}

export default function SellerDashboard({ stats, recent_sales, hourly_activity, top_products, urgent_orders, activity_logs = [] }: DashboardProps) {
  const [timeRange, setTimeRange] = React.useState('Daily');
  
  const handleExport = () => {
    alert('Generating Artisanal Sales Report... Your CSV will be ready in a moment.');
  };

  return (
    <SellerLayout>
      <Head title="Seller Dashboard" />

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Artisanal Growth</h1>
          <p className="text-gray-500 font-medium">Cultivating excellence in every batch today.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export Report
          </button>
          <a
            href="/seller/products"
            className="flex items-center gap-2 px-6 py-3 bg-[#eca840] text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-[#eca840]/30 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            New Product
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 mb-12">
        <StatCard label="Total Revenue" value={`₱${(stats?.total_revenue || 0).toLocaleString()}`} change={`Today: ₱${(stats?.today_revenue || 0).toLocaleString()}`} icon="revenue" />
        <StatCard label="Active Orders" value={(stats?.active_orders || 0).toString()} change="Live Tracking" icon="orders" />
        <StatCard label="Low Stock Alerts" value={(stats?.low_stock_alerts || 0).toString().padStart(2, '0')} change="Action Required" icon="stock" type="alert" alert={stats?.low_stock_alerts > 0} />
        <StatCard label="Pre-Order Momentum" value={(stats?.pre_order_count || 0).toString().padStart(2, '0')} change="In Production" icon="preorder" type="momentum" />
        <StatCard label="Total Customers" value={(stats?.new_customers || 0).toLocaleString()} change={stats?.today_signups > 0 ? `+${stats.today_signups} signed up today` : "Total Growth"} icon="customers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Trend Analysis */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {timeRange === 'Today' ? 'Today\'s Hourly Activity' : 'Recent Sales Trend'}
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                {timeRange === 'Today' ? 'Live order distribution' : 'Weekly performance visualization'}
              </p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#eca840]/20 transition-all cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Daily">Last 7 Days</option>
              <option value="Monthly">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end justify-between h-64 gap-5 px-4">
            {(() => {
              const displayData = timeRange === 'Today' 
                ? (hourly_activity || []).map((count, hr) => ({
                    label: hr % 6 === 0 ? (hr === 0 ? '12AM' : hr === 12 ? '12PM' : (hr > 12 ? hr-12 : hr) + (hr >= 12 ? 'PM' : 'AM')) : '',
                    fullLabel: hr === 0 ? '12 AM' : hr === 12 ? '12 PM' : (hr > 12 ? hr-12 : hr) + (hr >= 12 ? ' PM' : ' AM'),
                    orders: count,
                    value: Math.max(count * 20, 5) // Scale for visibility
                  }))
                : recent_sales.map(item => ({
                    label: item.day,
                    fullLabel: item.day,
                    orders: item.orders,
                    value: item.value || 5
                  }));

              return displayData.map((item, idx) => {
                const isToday = timeRange === 'Today' 
                  ? new Date().getHours() === idx
                  : new Date().toLocaleDateString('en-US', { weekday: 'short' }) === item.label;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div className="absolute -top-8 px-2 py-1 bg-gray-900 text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                      {item.orders || 0} {timeRange === 'Today' ? `AT ${item.fullLabel}` : 'ORDERS'}
                    </div>
                    
                    {item.orders > 0 && (
                      <span className={`text-[8px] font-bold mb-3 transition-colors ${isToday ? 'text-[#eca840]' : 'text-gray-300'}`}>
                        {item.orders}
                      </span>
                    )}
                    
                    <div
                      style={{ height: `${Math.min(item.value, 100)}%` }}
                      className={`w-full rounded-2xl transition-all duration-700 cursor-pointer relative overflow-hidden group-hover:shadow-2xl ${
                        isToday 
                          ? 'bg-gradient-to-t from-[#eca840] to-[#f4c47d] shadow-lg shadow-[#eca840]/20' 
                          : 'bg-[#f0f0f0] hover:bg-[#e0e0e0]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    
                    {(item.label || timeRange !== 'Today') && (
                      <span className={`mt-5 text-[10px] font-black uppercase tracking-widest transition-colors ${isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Live Store Pulse */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Live Store Pulse</h3>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full animate-pulse uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Live
            </span>
          </div>

          <div className="space-y-8 flex-1">
            {activity_logs?.length > 0 ? (
              activity_logs.map((log: any, idx: number) => (
                <div key={log.id || idx} className="relative group pl-8">
                  {/* Vertical line connector */}
                  {idx !== activity_logs.length - 1 && (
                    <div className="absolute left-[7px] top-4 w-[2px] h-[calc(100%+32px)] bg-gray-50 group-hover:bg-[#eca840]/20 transition-colors"></div>
                  )}
                  
                  {/* Indicator Dot */}
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125 ${
                    log.action === 'Order Placement' ? 'bg-[#eca840]' : 
                    log.action.includes('Archived') ? 'bg-red-400' :
                    log.action.includes('Restock') ? 'bg-indigo-400' : 'bg-gray-300'
                  }`}></div>

                  <div className="mb-1 flex justify-between items-start">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.username || 'System'}</span>
                    <span className="text-[9px] font-bold text-gray-300">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-[#eca840] transition-colors">{log.action}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-1 font-medium italic opacity-80">{log.metadata?.details || 'System operation processed successfully.'}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">Awaiting activity...</p>
              </div>
            )}
          </div>

          <Link 
            href="/seller/activity"
            className="block w-full mt-10 py-5 text-center border border-gray-100 rounded-[1.5rem] text-[10px] font-black text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-[0.2em] group"
          >
            Audit Timeline
            <svg className="w-3 h-3 inline-block ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Top Selling Goods */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-between">
        Top Selling Artisanal Goods
        <Link href="/seller/products" className="text-sm text-[#eca840] font-bold flex items-center gap-1.5 cursor-pointer hover:underline group">
          Inventory Manager 
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {top_products?.map((product: any) => (
          <ProductMiniCard
            key={product.id}
            title={product.name}
            price={`₱${product.price.toLocaleString()}`}
            stock={product.stock}
            badge={product.is_featured ? "BESTSELLER" : ""}
            image={product.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400"}
            isLowStock={product.stock <= 8}
          />
        ))}
      </div>

    </SellerLayout>
  );
}

const StatCard = ({ label, value, change, icon, type = 'normal', alert }: any) => (
  <div className={`stat-card transition-all duration-500 ${alert ? 'border-red-200 bg-red-50/10' : ''} ${type === 'momentum' ? 'border-indigo-100 bg-indigo-50/5' : ''}`}>
    <div className="stat-header">
      <div className={`stat-icon-bg transition-all ${
        type === 'alert' || alert ? 'bg-red-500 text-white' : 
        type === 'momentum' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
        'bg-[#fdfaf5] text-[#eca840]'
      }`}>
        {/* Icons */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon === 'revenue' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          {icon === 'orders' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          {icon === 'stock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
          {icon === 'customers' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
          {icon === 'preorder' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
        </svg>
      </div>
      <div className={`stat-badge animate-in fade-in zoom-in duration-500 ${
        type === 'alert' || alert ? 'bg-red-100 text-red-600' : 
        type === 'momentum' ? 'bg-indigo-100 text-indigo-600' :
        'bg-green-100 text-green-600'
      }`}>
        {change}
      </div>
    </div>
    <p className="stat-label">{label}</p>
    <h2 className={`stat-value ${alert ? 'text-red-700' : ''}`}>{value}</h2>
  </div>
);

const ActionItem = ({ id, task, time, status }: any) => (
  <div className="relative pl-6 border-l-4 border-[#eca840]/30 hover:border-[#eca840] transition-all">
    <div className="flex justify-between items-start mb-1">
      <span className="text-[10px] font-bold text-gray-400">{id}</span>
      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${status === 'Urgent' ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'}`}>{status}</span>
    </div>
    <h4 className="text-sm font-bold text-gray-800 mb-1">{task}</h4>
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-gray-400 font-medium">{time}</span>
      <span className="text-[11px] text-[#eca840] font-bold cursor-pointer hover:underline">{status === 'Urgent' ? 'Process Now' : 'Details'}</span>
    </div>
  </div>
);

const ProductMiniCard = ({ title, price, stock, badge, image, isLowStock }: any) => (
  <div className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
    <div className="relative aspect-video overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      {badge && <span className="absolute top-4 left-4 bg-[#eca840] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-lg">{badge}</span>}
    </div>
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="text-lg font-bold text-[#eca840]">{price}</span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Level</p>
          <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${isLowStock ? 15 : 85}%` }}
              className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-[#eca840]'}`}
            ></div>
          </div>
        </div>
        <span className={`text-xs font-bold ${isLowStock ? 'text-red-500' : 'text-gray-900'}`}>{stock} units</span>
      </div>
    </div>
  </div>
);
