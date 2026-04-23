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
  trend_data: {
    hourly: Array<{ label: string; fullLabel: string; orders: number; value: number }>;
    daily: Array<{ label: string; orders: number; value: number }>;
    weekly: Array<{ label: string; orders: number; value: number }>;
    monthly: Array<{ label: string; orders: number; value: number }>;
  };
  top_products: any[];
  urgent_orders: any[];
  activity_logs: any[];
}

export default function SellerDashboard({ stats, trend_data, top_products, urgent_orders, activity_logs = [] }: DashboardProps) {
  const [timeRange, setTimeRange] = React.useState('Daily');
  
  const handleExport = () => {
    alert('Generating Artisanal Sales Report... Your CSV will be ready in a moment.');
  };

  const getDisplayData = () => {
    switch (timeRange) {
      case 'Today': return trend_data.hourly;
      case 'Daily': return trend_data.daily;
      case 'Weekly': return trend_data.weekly;
      case 'Monthly': return trend_data.monthly;
      default: return trend_data.daily;
    }
  };

  const displayData = getDisplayData();

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        <StatCard label="Total Revenue" value={`₱${(stats?.total_revenue || 0).toLocaleString()}`} change={`Today: ₱${(stats?.today_revenue || 0).toLocaleString()}`} icon="revenue" />
        <StatCard label="Active Orders" value={(stats?.active_orders || 0).toString()} change="Live Tracking" icon="orders" />
        <StatCard label="Low Stock Alerts" value={(stats?.low_stock_alerts || 0).toString().padStart(2, '0')} change="Action Required" icon="stock" type="alert" alert={stats?.low_stock_alerts > 0} />
        <StatCard label="Total Customers" value={(stats?.new_customers || 0).toLocaleString()} change={stats?.today_signups > 0 ? `+${stats.today_signups} signed up today` : "Total Growth"} icon="customers" />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Live Store Pulse - Now more prominent */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Live Store Pulse</h3>
              <p className="text-sm text-gray-400 font-medium">Real-time operational awareness across your artisanal empire.</p>
            </div>
            <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black rounded-xl animate-pulse uppercase tracking-widest border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Live Tracking Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
            <div className="space-y-8 overflow-y-auto custom-scrollbar pr-4 max-h-[400px]">
              {activity_logs?.slice(0, Math.ceil(activity_logs.length / 2)).map((log: any, idx: number) => (
                <ActivityItem key={log.id || idx} log={log} isLast={idx === Math.ceil(activity_logs.length / 2) - 1} />
              ))}
            </div>
            <div className="space-y-8 overflow-y-auto custom-scrollbar pr-4 max-h-[400px]">
              {activity_logs?.slice(Math.ceil(activity_logs.length / 2)).map((log: any, idx: number) => (
                <ActivityItem key={log.id || idx} log={log} isLast={idx === (activity_logs.length - Math.ceil(activity_logs.length / 2)) - 1} />
              ))}
              {activity_logs?.length === 0 && (
                <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-100">
                  <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">Awaiting system pings...</p>
                </div>
              )}
            </div>
          </div>

          <Link 
            href="/seller/activity"
            className="block w-full mt-12 py-5 text-center border border-gray-100 rounded-[1.5rem] text-[10px] font-black text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-[0.3em] group"
          >
            Access Full Audit Infrastructure
            <svg className="w-3 h-3 inline-block ml-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Top Selling Goods */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Market Leading Goods</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Products currently dominating your sales charts.</p>
          </div>
          <Link href="/seller/products" className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-400 hover:text-gray-900 rounded-xl transition-all uppercase tracking-widest border border-gray-100">
            Inventory Hub
          </Link>
        </div>
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
      </div>

      {/* Recent Sales Trend - Moved to Bottom with Professional UI */}
      <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] mb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
              Recent Sales Performance Trend
            </h3>
            <p className="text-sm text-[#eca840] font-bold uppercase tracking-[0.2em]">
              {timeRange === 'Today' ? 'Intraday Market Velocity' : 
               timeRange === 'Daily' ? 'Weekly Operational Pulse' : 
               timeRange === 'Weekly' ? 'Monthly Growth Visualization' : 'Annual Strategic Trend'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {['Today', 'Daily', 'Weekly', 'Monthly'].map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        timeRange === range 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {range}
                </button>
            ))}
          </div>
        </div>

        <div className="relative pt-12">
          {/* Y-Axis Background Lines */}
          <div className="absolute inset-0 pt-12 flex flex-col justify-between pointer-events-none opacity-[0.03]">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-900"></div>
              ))}
          </div>

          <div className="flex items-end justify-around h-80 gap-4 md:gap-8 px-10 relative z-10">
            {displayData.map((item: any, idx: number) => {
              const isCurrent = timeRange === 'Today' 
                ? new Date().getHours() === idx
                : timeRange === 'Daily' && new Date().toLocaleDateString('en-US', { weekday: 'short' }) === item.label;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  <div className="absolute -top-12 px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2 whitespace-nowrap z-20 shadow-2xl scale-95 group-hover:scale-100">
                    <span className="text-[#eca840] mr-2">{item.orders || 0}</span>
                    ORDERS — {(item.fullLabel || item.label).toUpperCase()}
                  </div>
                  
                  <div
                    style={{ height: `${Math.max(Math.min(item.value, 100), 5)}%` }}
                    className={`w-full rounded-2xl transition-all duration-1000 ease-out cursor-pointer relative overflow-hidden ${
                      isCurrent 
                        ? 'bg-gradient-to-t from-[#eca840] to-[#f4c47d] shadow-[0_15px_30px_-10px_rgba(236,168,64,0.4)]' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  
                  <div className="mt-8 flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${isCurrent ? 'text-gray-900 scale-110' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                      {isCurrent && <div className="w-1 h-1 rounded-full bg-[#eca840]"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

const StatCard = ({ label, value, change, icon, type = 'normal', alert }: any) => (
  <div className={`stat-card transition-all duration-500 ${alert ? 'border-red-200 bg-red-50/10' : ''}`}>
    <div className="stat-header">
      <div className={`stat-icon-bg transition-all ${
        type === 'alert' || alert ? 'bg-red-500 text-white' : 
        'bg-[#fdfaf5] text-[#eca840]'
      }`}>
        {/* Icons */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon === 'revenue' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          {icon === 'orders' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          {icon === 'stock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
          {icon === 'customers' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
        </svg>
      </div>
      <div className={`stat-badge animate-in fade-in zoom-in duration-500 ${
        type === 'alert' || alert ? 'bg-red-100 text-red-600' : 
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

const ActivityItem = ({ log, isLast }: any) => (
  <div className="relative group pl-8">
    {!isLast && (
      <div className="absolute left-[7px] top-4 w-[2px] h-[calc(100%+32px)] bg-gray-50 group-hover:bg-[#eca840]/20 transition-colors"></div>
    )}
    
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
