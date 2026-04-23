import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

interface AnalyticsProps {
  metrics: {
    total_revenue: number;
    today_revenue: number;
    avg_prep_time: number;
    fulfillment_rate: number;
    revenue_change: string;
  };
  revenue_overview: Array<{ month: string; revenue: number }>;
  category_performance: Array<{ name: string; percentage: number }>;
  bestselling_products: Array<{ name: string; units_sold: number; revenue: number; status: string }>;
  customer_insights: {
    peak_hours: string[];
    peak_period: string;
    retention_rate: string;
    repeat_purchases: string;
    raw_customer_count: number;
    hourly_activity?: number[];
  };
  activity_logs: any[];
}

export default function SellerAnalytics({ metrics, revenue_overview, category_performance, bestselling_products, customer_insights, activity_logs = [] }: AnalyticsProps) {
  const handleBatchPrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Percentage'];
    const dataRows = category_performance.map(c => `${c.name},${c.percentage}%`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + dataRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "artisanal_analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SellerLayout>
      <Head title="Sales Analytics" />

      <div className="flex justify-between items-end mb-12 no-print">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">Sales Analytics</h1>
          <p className="text-gray-500 font-medium text-lg">Real-time performance metrics synchronized with store activity.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleBatchPrint}
            className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-3xl text-sm font-bold text-gray-700 hover:shadow-xl transition-all active:scale-95"
          >
             <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
             Batch Print
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-3 px-8 py-4 bg-[#f5a623] text-white rounded-3xl text-sm font-bold hover:shadow-xl hover:shadow-[#f5a623]/30 transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <MetricCard 
          label="Total Revenue" 
          value={`₱${(metrics?.total_revenue || 0).toLocaleString()}`} 
          subtext={`Today: ₱${(metrics?.today_revenue || 0).toLocaleString()}`}
          subIcon="trending_up"
          icon="revenue" 
        />
        <MetricCard 
          label="Fulfillment Rate" 
          value={metrics?.fulfillment_rate >= 0 ? `${metrics.fulfillment_rate}%` : '—'} 
          subtext={metrics?.fulfillment_rate > 0 ? ((metrics.fulfillment_rate >= 90) ? 'Excellent performance' : (metrics.fulfillment_rate >= 70) ? 'Good performance' : 'Needs attention') : 'No orders completed yet'}
          subIcon="check"
          icon="fulfillment" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Revenue Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black text-gray-900">Revenue Overview</h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#f5a623] rounded-full"></div>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Revenue</span>
              </div>
           </div>
           
            <div className="flex items-end justify-between h-64 gap-4 px-2">
               {(() => {
                 const revenues = revenue_overview?.map(r => Number(r.revenue) || 0);
                 const maxRevenue = Math.max(...revenues, 1);
                 const currentMonth = new Date().toLocaleString('default', { month: 'short' });
                 return revenue_overview?.map((item, idx) => {
                   const pct = Math.max((revenues[idx] / maxRevenue) * 100, 8);
                   const isCurrent = item.month === currentMonth;
                   return (
                     <div key={item.month} className="flex-1 flex flex-col items-center gap-3 group relative">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-lg whitespace-nowrap transition-all pointer-events-none z-10">
                          ₱{(revenues[idx] || 0).toLocaleString()}
                        </div>
                        <div
                         style={{ height: `${pct}%` }}
                         className={`w-full rounded-2xl transition-all duration-700 cursor-pointer ${isCurrent ? 'bg-[#f5a623] shadow-lg shadow-[#f5a623]/30' : 'bg-[#fff1de] group-hover:bg-[#ffd99a]'}`}
                        ></div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-[#f5a623]' : 'text-gray-400'}`}>{item.month.toUpperCase()}</span>
                     </div>
                   );
                 });
               })()}
            </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm flex flex-col items-center">
           <h3 className="text-2xl font-black text-gray-900 mb-12 w-full">Category Performance</h3>
           
           <div className="relative w-64 h-64 mb-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 {category_performance?.map((cat, i) => {
                    const offset = category_performance.slice(0, i).reduce((acc, curr) => acc + (curr.percentage * 2.512), 0);
                    const colors = ['#f5a623', '#5c4033', '#000000', '#ede7e3'];
                    return (
                       <circle 
                         key={cat.name}
                         cx="50" cy="50" r="40" 
                         stroke={colors[i] || '#ede7e3'} 
                         strokeWidth="12" fill="transparent" 
                         strokeDasharray="251.2" 
                         strokeDashoffset={251.2 - (cat.percentage * 2.512)}
                         transform={`rotate(${offset * (360/251.2)} 50 50)`}
                       ></circle>
                    );
                 })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                 <span className="text-3xl font-black text-gray-900">100%</span>
              </div>
           </div>

           <div className="w-full space-y-6">
              {category_performance?.map((cat, i) => (
                <div key={cat.name} className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      {(() => {
                          const colors = ['bg-[#f5a623]', 'bg-[#5c4033]', 'bg-black', 'bg-[#ede7e3]'];
                          return <div className={`w-3 h-3 rounded-full ${colors[i] || 'bg-[#ede7e3]'}`}></div>;
                      })()}
                      <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                   </div>
                   <span className="text-sm font-black text-gray-900">{cat.percentage}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Bestselling Products */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm">
           <h3 className="text-2xl font-black text-gray-900 mb-10">Bestselling Products</h3>
           <div className="space-y-8">
              {bestselling_products?.map((product, i) => (
                <div key={product.name} className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                         <span className="text-lg font-black text-[#f5a623]">{product.name.charAt(0)}</span>
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h4>
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{product.units_sold} units sold</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black text-gray-900 mb-1">₱{(product.revenue || 0).toLocaleString()}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${product.status === 'Top Performer' ? 'text-green-500' : (product.status === 'Trending up' ? 'text-orange-500' : 'text-gray-400')}`}>
                        {product.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Customer Insights */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm flex flex-col">
           <h3 className="text-2xl font-black text-gray-900 mb-2">Customer Insights</h3>
           <p className="text-xs text-gray-400 font-medium mb-12">Engagement and behavior metrics.</p>
           
           <div className="mb-12">
              <div className="flex justify-between items-end mb-6">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ">Peak Ordering Hours</span>
                 <span className="bg-orange-50 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full">{customer_insights?.peak_period || 'N/A'}</span>
              </div>
               <div className="flex items-end justify-between h-24 gap-3 bg-gray-50/50 p-6 rounded-[2rem]">
                  {(() => {
                    const activity = customer_insights?.hourly_activity || [20, 40, 60, 90, 80, 50, 30, 15];
                    // Map 24-hour activity to 8 sample bars for the UI
                    const samples = [activity[6], activity[9], activity[12], activity[15], activity[18], activity[21], activity[0], activity[3]];
                    const maxAct = Math.max(...samples, 5);
                    return samples.map((h, i) => (
                      <div key={i} className={`flex-1 rounded-lg ${h === Math.max(...samples) ? 'bg-[#f5a623]' : 'bg-[#ffe8ca]'}`} style={{ height: `${(h / maxAct) * 100}%` }}></div>
                    ));
                  })()}
               </div>

              <div className="flex justify-between px-2 mt-4">
                 {customer_insights?.peak_hours?.map(h => (
                   <span key={h} className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{h}</span>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6 mt-auto">
              <div className="bg-gray-50/50 rounded-[2rem] p-6">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Customer Retention</p>
                 <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-gray-900">{customer_insights?.retention_rate || '0%'}</span>
                    <span className="text-[10px] font-bold text-green-500">+4%</span>
                 </div>
              </div>
              <div className="bg-gray-50/50 rounded-[2rem] p-6">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Repeat Purchases</p>
                 <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-gray-900">{(customer_insights?.repeat_purchases || '0 avg').split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-gray-400">{(customer_insights?.repeat_purchases || '0 avg').split(' ').slice(1).join(' ')}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm mt-12 no-print">
         <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-2xl font-black text-gray-900 mb-1">Operational Audit Trail</h3>
               <p className="text-sm text-gray-400 font-medium">Detailed log of recent system events and manual inventory adjustments.</p>
            </div>
            <Link href="/seller/activity" className="text-xs font-black text-[#f5a623] uppercase tracking-widest hover:underline">Full System Logs</Link>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="border-b border-gray-50">
                     <th className="text-left py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                     <th className="text-left py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operator</th>
                     <th className="text-left py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                     <th className="text-left py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Details</th>
                     <th className="text-right py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {activity_logs?.length > 0 ? (
                    activity_logs.map((log: any) => (
                      <tr key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                         <td className="py-6 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-900">{new Date(log.created_at).toLocaleDateString()}</span>
                            <span className="text-[10px] text-gray-400 ml-2">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </td>
                         <td className="py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-[#fff1de] flex items-center justify-center text-[10px] font-black text-[#f5a623]">
                                  {log.username?.charAt(0) || 'S'}
                               </div>
                               <span className="text-sm font-bold text-gray-700">{log.username || 'System'}</span>
                            </div>
                         </td>
                         <td className="py-6">
                            <span className="text-sm font-bold text-gray-900">{log.action}</span>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{log.category}</div>
                         </td>
                         <td className="py-6">
                            <p className="text-xs text-gray-500 max-w-md line-clamp-1">{log.metadata?.details || 'Background operation completed.'}</p>
                         </td>
                         <td className="py-6 text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               log.status === 'success' ? 'bg-green-50 text-green-600' : 
                               log.status === 'warning' ? 'bg-orange-50 text-orange-600' : 
                               'bg-red-50 text-red-600'
                            }`}>
                               {log.status || 'Processed'}
                            </span>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={5} className="py-20 text-center text-sm text-gray-400 font-medium italic">No recent operational data found.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </SellerLayout>
  );
}

const MetricCard = ({ label, value, subtext, subIcon, icon }: any) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative group hover:shadow-2xl transition-all h-full">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{label}</p>
    <h2 className="text-5xl font-black text-gray-900 mb-8">{value}</h2>
    
    <div className="flex items-center gap-3">
       {subIcon === 'trend' && (
         <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16" /></svg>
         </div>
       )}
       {subIcon === 'target' && (
         <div className="w-5 h-5 rounded-md bg-rose-50 flex items-center justify-center text-rose-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
         </div>
       )}
       {subIcon === 'check' && (
         <div className="w-5 h-5 rounded-md bg-green-50 flex items-center justify-center text-green-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
         </div>
       )}
     {subIcon === 'warn' && (
         <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center text-orange-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
         </div>
       )}
       <span className={`text-xs font-bold leading-none ${subIcon === 'trend' ? 'text-green-500' : (subIcon === 'warn' ? 'text-orange-500' : (subIcon === 'target' ? 'text-gray-400' : 'text-green-500'))}`}>
          {subtext}
       </span>
    </div>
  </div>
);
