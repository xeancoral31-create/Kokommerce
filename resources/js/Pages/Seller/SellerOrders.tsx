import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';

interface OrdersProps {
  orders: any[];
  stats: {
    today_revenue: number;
    avg_prep_time: string;
    fulfillment_rate: string;
  };
}

export default function SellerOrders({ orders, stats }: OrdersProps) {
  const [activeTab, setActiveTab] = React.useState('All Orders');
  const tabs = ['All Orders', 'Pending', 'Preparing', 'Out for Delivery', 'Completed'];

  return (
    <SellerLayout>
      <Head title="Order Management" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Order Management</h1>
          <p className="text-gray-500 font-medium">Efficiently process and track your bakery's orders.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >

            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Batch Print
          </button>
          <button 
            onClick={() => {
              const headers = ["Order ID", "Customer", "Date", "Total", "Status"];
              const rows = orders.map(o => [
                o.order_reference || 'N/A',
                o.buyer?.name || 'Guest',
                'Oct 24, 10:30 AM',
                `₱${parseFloat(o.total_amount || 0).toLocaleString()}`,
                o.status || 'Pending'
              ]);
              const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csvContent));
              link.setAttribute("download", "order_report.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-[#eca840] text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-[#eca840]/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <OrderStat 
          label="Today's Revenue" 
          value={`₱${stats.today_revenue.toLocaleString()}`} 
          change={stats.today_revenue > 0 ? "+12.5% vs yesterday" : "No sales today"} 
          changeType={stats.today_revenue > 0 ? "positive" : "neutral"} 
        />
        <OrderStat 
          label="Average Prep Time" 
          value={stats.avg_prep_time} 
          change={stats.avg_prep_time !== 'No data yet' ? "On target (Goal < 15m)" : "Awaiting first delivery"} 
          changeType="neutral" 
          showIcon="target" 
        />
        <OrderStat 
          label="Fulfillment Rate" 
          value={stats.fulfillment_rate} 
          change={stats.fulfillment_rate !== 'No data yet' ? "Excellent performance" : "No orders completed yet"} 
          changeType={stats.fulfillment_rate !== 'No data yet' ? "positive" : "neutral"} 
          showIcon="check" 
        />
      </div>

      <div className="mb-12">
        {/* Order Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50">
             <div className="flex bg-gray-50 p-1 rounded-2xl gap-2">
               {tabs.map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                Sorted by Date
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m5-4l4 4m0 0l4-4m-4 4V20" /></svg>
             </div>
          </div>

          <table className="seller-table border-none">
            <thead>
              <tr className="border-none">
                <th className="bg-transparent border-none">Order ID</th>
                <th className="bg-transparent border-none">Customer</th>
                <th className="bg-transparent border-none">Date</th>
                <th className="bg-transparent border-none">Total</th>
                <th className="bg-transparent border-none">Status</th>
                <th className="bg-transparent border-none text-right">Action</th>
              </tr>
            </thead>
            <tbody>
               {orders.map((order, i) => (
                 <tr key={order.id || i}>
                   <td className="font-bold text-gray-900">#{order.order_reference || `KK-89${21-i}`}</td>
                   <td>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Customer" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{order.buyer?.name || 'Sarah Miller'}</span>
                     </div>
                   </td>
                   <td className="text-sm text-gray-400 font-medium">Oct 24, 10:30 AM</td>
                   <td className="font-extrabold text-gray-900">${parseFloat(order.total_amount || 45.50).toFixed(2)}</td>
                   <td>
                     <span className={`status-badge ${i === 2 ? 'active' : (i === 1 ? 'out_delivery' : 'urgent')}`}>
                       {i === 2 ? 'COMPLETED' : (i === 1 ? 'OUT FOR DELIVERY' : 'PREPARING')}
                     </span>
                   </td>
                   <td className="text-right">
                     <button className="p-2 text-gray-400 hover:text-gray-600 font-bold">...</button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
          
          <div className="p-8 border-t border-gray-50 flex justify-between items-center">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 4 of 248 orders</span>
             <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
             </div>
          </div>
        </div>
      </div>

    </SellerLayout>
  );
}

const OrderStat = ({ label, value, change, changeType, showIcon }: any) => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    <div className="flex items-baseline gap-4 mb-4">
      <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>
    </div>
    <div className={`flex items-center gap-2 text-[10px] font-bold ${changeType === 'positive' ? 'text-green-500' : 'text-gray-400'}`}>
       {showIcon === 'target' && <span className="bg-orange-50 p-1 rounded-full text-orange-500">🎯</span>}
       {showIcon === 'check' && <span className="bg-green-50 p-1 rounded-full text-green-500">✓</span>}
       {!showIcon && <span className="p-1 rounded-full text-green-500">📈</span>}
       {change}
    </div>
  </div>
);
