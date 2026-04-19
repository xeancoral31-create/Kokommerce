import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';

interface DashboardProps {
  stats: {
    total_revenue: number;
    active_orders: number;
    low_stock_alerts: number;
    new_customers: number;
  };
  recent_sales: Array<{ day: string; value: number }>;
  top_products: any[];
  urgent_orders: any[];
}

export default function SellerDashboard({ stats, recent_sales, top_products, urgent_orders }: DashboardProps) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard label="Total Revenue" value={`₱${(stats?.total_revenue || 0).toLocaleString()}`} change="Real-time" icon="revenue" />
        <StatCard label="Active Orders" value={(stats?.active_orders || 0).toString()} change="Live Tracking" icon="orders" />
        <StatCard label="Low Stock Alerts" value={(stats?.low_stock_alerts || 0).toString().padStart(2, '0')} change="Action Required" icon="stock" type="alert" alert={stats?.low_stock_alerts > 0} />
        <StatCard label="New Customers" value={(stats?.new_customers || 0).toLocaleString()} change="Total Growth" icon="customers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Trend Analysis */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Recent Sales Trend</h3>
              <p className="text-sm text-gray-400 font-medium">Weekly performance visualization</p>
            </div>
            <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-xl px-4 py-2 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-4 px-2">
            {recent_sales.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center group">
                <div 
                  style={{ height: `${item.value}%` }} 
                  className={`w-full rounded-2xl transition-all duration-500 cursor-pointer ${item.day === 'Sun' ? 'bg-[#eca840] shadow-lg shadow-[#eca840]/30' : 'bg-[#f7e2c4] group-hover:bg-[#f2d5ad]'}`}
                ></div>
                <span className="mt-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Action */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
           <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
             <span className="text-red-500">⚡</span> Immediate Action
           </h3>
           
           <div className="space-y-6">
             {urgent_orders?.length > 0 ? (
               urgent_orders.map((order: any) => (
                 <ActionItem 
                  key={order.id}
                  id={order.order_reference} 
                  task={order.items_data?.[0]?.name || "New Batch Order"} 
                  time={order.status === 'Pending' ? 'New Request' : 'In Preparation'} 
                  status={order.status === 'Pending' ? 'Urgent' : 'Active'} 
                 />
               ))
             ) : (
               <p className="text-xs text-gray-400 text-center py-10 font-medium">All gourmet orders have been processed.</p>
             )}
           </div>

           <button className="w-full mt-10 py-4 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
             View All Queue
           </button>
        </div>
      </div>

      {/* Top Selling Goods */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-between">
        Top Selling Artisanal Goods
        <span className="text-sm text-[#eca840] font-bold flex items-center gap-1 cursor-pointer">Inventory Manager <span>→</span></span>
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
  <div className={`stat-card transition-all duration-500 ${alert ? 'border-red-200 bg-red-50/10' : ''}`}>
    <div className="stat-header">
      <div className={`stat-icon-bg transition-all ${type === 'alert' || alert ? 'bg-red-500 text-white' : 'bg-[#fdfaf5] text-[#eca840]'}`}>
         {/* Placeholder Icons */}
         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           {icon === 'revenue' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
           {icon === 'orders' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
           {icon === 'stock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
           {icon === 'customers' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
         </svg>
      </div>
      <div className={`stat-badge animate-in fade-in zoom-in duration-500 ${type === 'alert' || alert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
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
