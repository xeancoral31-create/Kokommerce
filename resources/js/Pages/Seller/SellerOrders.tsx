import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

interface OrdersProps {
  orders: any[];
  stats: {
    total_revenue: number;
    today_revenue: number;
    revenue_change: string;
    avg_prep_time: string;
    fulfillment_rate: string;
  };
}

export default function SellerOrders({ orders, stats }: OrdersProps) {
  const [activeTab, setActiveTab] = React.useState('All Orders');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [sortDateDesc, setSortDateDesc] = React.useState(true);
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Functional Pagination Logic
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const tabs = ['All Orders', 'Pending', 'Preparing', 'Out for Delivery', 'Completed'];

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return sortDateDesc ? dateB - dateA : dateA - dateB;
  });

  const filteredOrders = React.useMemo(() => {
    let result = activeTab === 'All Orders' 
      ? sortedOrders 
      : sortedOrders.filter(o => o.status === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        (o.order_reference || '').toLowerCase().includes(q) ||
        (o.buyer?.name || '').toLowerCase().includes(q) ||
        (o.buyer?.email || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, sortedOrders, searchQuery]);

  // Paginated Results
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filtering/searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return orders.filter(o => 
      (o.order_reference || '').toLowerCase().includes(q) ||
      (o.buyer?.name || '').toLowerCase().includes(q)
    ).slice(0, 5);
  }, [orders, searchQuery]);

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    Inertia.put(`/seller/orders/${orderId}`, { status: newStatus }, {
      preserveScroll: true,
      onSuccess: () => setOpenDropdownId(null)
    });
  };

  const openDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <SellerLayout>
      <Head title="Order Management" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-[#2d2a26] tracking-tight mb-3">Administrative Hub</h1>
          <div className="flex items-center gap-3">
             <span className="w-10 h-[2px] bg-[#eca840]"></span>
             <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Registry of Order Trajectories</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm group"
          >
            <svg className="w-4 h-4 group-hover:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print
          </button>
          <button 
            onClick={() => {
              const headers = ["Order ID", "Customer", "Date", "Total", "Status"];
              const rows = orders.map(o => [
                o.order_reference || 'N/A',
                o.buyer?.name || 'Guest',
                new Date(o.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
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
            className="flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2d2a26] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eca840] hover:shadow-xl hover:shadow-[#eca840]/20 transition-all border border-[#2d2a26] hover:border-[#eca840]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export
          </button>
        </div>
      </div>

      {/* Artisanal Order Search Engine Hub */}
      <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-3 lg:p-4 border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] mb-12 flex flex-col xl:flex-row items-stretch xl:items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4 lg:pl-4 py-2">
            <div className="relative min-w-[180px]">
                <div className="relative group">
                    <select 
                        value={activeTab}
                        onChange={e => setActiveTab(e.target.value)}
                        className="w-full appearance-none bg-orange-50/30 border border-transparent rounded-xl pl-5 pr-10 py-3.5 text-[10px] font-black uppercase tracking-wider text-[#eca840] focus:ring-4 focus:ring-[#eca840]/10 focus:border-[#eca840]/20 cursor-pointer transition-all hover:bg-orange-50"
                    >
                        {tabs.map(tab => (
                            <option key={tab} value={tab} className="font-bold text-gray-700 uppercase">{tab}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#eca840]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            <div className="w-[1px] h-8 bg-gray-100 mx-2 hidden xl:block"></div>

            <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300 group-focus-within:text-[#eca840] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Customer name..." 
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none pl-8 pr-4 py-3.5 text-xs font-bold text-gray-700 focus:ring-0 placeholder:text-gray-300 transition-all font-outfit"
                />
                
                {/* Search Results Dropdown */}
                {isSearchFocused && searchResults.length > 0 && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-2xl p-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                        <p className="px-3 mb-3 text-[9px] font-black text-gray-300 uppercase tracking-widest">Quick Results</p>
                        <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                            {searchResults.map((order, i) => (
                                <button
                                    key={order.id || i}
                                    onClick={() => setSearchQuery(order.order_reference)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#eca840]">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-[#eca840] transition-colors">{order.order_reference}</p>
                                            <p className="text-[9px] font-medium text-gray-400 truncate w-32">{order.buyer?.name}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-3 pr-2 pl-4 xl:pl-0 border-t xl:border-t-0 xl:border-l border-gray-100 pt-3 xl:pt-0">
            <button 
                onClick={() => setSortDateDesc(!sortDateDesc)}
                className="flex items-center gap-2.5 px-5 py-3 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all font-outfit"
            >
                {sortDateDesc ? 'Newest First' : 'Oldest First'}
                <svg className={`w-3.5 h-3.5 transition-transform duration-500 ${!sortDateDesc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 12l-4-4m4 4l4-4m5-4l4 4m0 0l4-4m-4 4V20" /></svg>
            </button>
        </div>
      </div>

      {/* Stats Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <OrderStat 
          label="Total Revenue" 
          value={`₱${(stats.total_revenue || 0).toLocaleString()}`} 
          change={`Today: ₱${(stats.today_revenue || 0).toLocaleString()}`}
          changeType="positive" 
        />
        <OrderStat 
          label="Fulfillment Rate" 
          value={stats.fulfillment_rate} 
          change={stats.fulfillment_rate !== 'No data yet' ? "System performance overview" : "No orders completed yet"} 
          changeType={stats.fulfillment_rate !== 'No data yet' ? "positive" : "neutral"} 
          showIcon="check" 
        />
      </div>

      <div className="mb-12">
        {/* Modern Order Management Data Theater */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-30">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#eca840] animate-pulse shadow-[0_0_10px_rgba(236,168,64,0.5)]"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Current Orders</h3>
             </div>
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/50">
                 Real-time artisan monitoring
             </div>
          </div>

          {/* Precision Scroll Viewport */}
          <div className="flex-1">
            <table className="w-full border-collapse">
                <thead className="bg-[#fcfaf7] border-b border-gray-100 sticky top-0 z-20">
                  <tr>
                    <th className="py-6 pl-10 pr-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Order ID</th>
                    <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Customer</th>
                    <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Date</th>
                    <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Total</th>
                    <th className="py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Status</th>
                    <th className="py-6 pr-10 pl-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                   {paginatedOrders.length > 0 ? paginatedOrders.map((order, i) => (
                     <tr 
                        key={order.id || i} 
                        onClick={() => openDetails(order)}
                        className="group hover:bg-[#fdfaf5]/50 transition-all duration-300 cursor-pointer"
                     >
                       <td className="py-7 pl-10 pr-6">
                          <span className="text-sm font-black text-gray-900 group-hover:text-[#eca840] transition-colors tabular-nums">#{order.order_reference}</span>
                       </td>
                       <td className="py-7 px-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 p-0.5 overflow-hidden shrink-0 group-hover:border-[#eca840]/20 transition-all shadow-inner">
                              <img src={order.buyer?.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt="Customer" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-gray-700 truncate max-w-[150px]">{order.buyer?.name}</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest truncate max-w-[150px]">{order.buyer?.email}</span>
                            </div>
                         </div>
                       </td>
                       <td className="py-7 px-6">
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-gray-700">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                             <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                       </td>
                       <td className="py-7 px-6">
                          <span className="text-base font-black text-gray-900 tabular-nums">₱{parseFloat(order.total_amount || 0).toLocaleString()}</span>
                       </td>
                       <td className="py-7 px-6">
                         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                           order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                           order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                           order.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                           'bg-gray-50 text-gray-600 border-gray-100'
                         }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : order.status === 'Pending' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'}`}></div>
                           <span className="whitespace-nowrap">{order.status || 'Processing'}</span>
                         </div>
                       </td>
                       <td className="py-7 pr-10 pl-6 text-right relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                            }}
                            className={`w-10 h-10 rounded-xl transition-all border flex items-center justify-center ${openDropdownId === order.id ? 'bg-[#eca840] text-white border-[#eca840] shadow-lg shadow-orange-500/20' : 'bg-gray-50 text-gray-300 hover:text-gray-900 hover:bg-gray-100 border-transparent hover:border-gray-100'}`}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h.01M12 12h.01M19 12h.01" /></svg>
                          </button>
                          
                          {openDropdownId === order.id && (
                            <div className="absolute right-10 top-full mt-2 w-56 bg-[#1a1c23] rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 border border-gray-800">
                               <div className="p-3 border-b border-gray-800 bg-gray-900/50">
                                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Update Order Trajectory</p>
                               </div>
                               <div className="p-2 space-y-1">
                                 {['Pending', 'Preparing', 'Out for Delivery', 'Completed'].map((status) => (
                                   <button
                                     key={status}
                                     onClick={() => updateOrderStatus(order.id, status)}
                                     className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === status ? 'bg-[#eca840] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                   >
                                     {status}
                                   </button>
                                 ))}
                               </div>
                            </div>
                          )}
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={6} className="py-40 text-center">
                            <div className="w-16 h-16 bg-gray-50/50 border border-dashed border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">No order discovery</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Check different trajectories or search queries</p>
                       </td>
                     </tr>
                   )}
                </tbody>
              </table>
          </div>
          
          <div className="p-6 lg:p-10 border-t border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-8 bg-[#fcfaf7] animate-in fade-in duration-700">
             <div className="flex flex-col text-center lg:text-left">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Administrative Footprint</span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} Records</span>
             </div>
             <div className="flex gap-4 w-full lg:w-auto">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${currentPage === 1 ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200'}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                </button>
                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200'}`}
                >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Artisanal Order Details Theater (Modal) */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#2d2a26]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] border border-[#eca840]/20">
            {/* Header */}
            <div className="p-8 lg:p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
               <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-[#2d2a26] tracking-tight">Order Expedition</h2>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="w-8 h-[2px] bg-[#eca840]"></span>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Manifest for Reference {selectedOrder.order_reference}</p>
                  </div>
               </div>
               <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm group"
               >
                 <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="col-span-2 space-y-8">
                  {/* Items List */}
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Provisioned Creations</h3>
                    <div className="space-y-4">
                      {selectedOrder.order_items?.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="bg-[#fcfaf7]/50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between group hover:border-[#eca840]/30 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 p-1 shadow-sm shrink-0 overflow-hidden group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                              <img 
                                src={item.product?.image || "https://images.unsplash.com/photo-1558961776-1073864c207f?w=200"} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900">{item.product?.name || "Artisanal Good"}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-[#eca840] text-white text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg">
                                    {item.quantity}x
                                </span>
                                <span className="text-[10px] font-black text-[#eca840] uppercase tracking-widest">
                                    {item.variant || 'Standard'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-gray-900">₱{parseFloat(item.subtotal || 0).toLocaleString()}</p>
                             <p className="text-[9px] font-bold text-gray-300 uppercase">₱{parseFloat(item.price || 0).toLocaleString()} per unit</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Detail */}
                  <div className="bg-[#2d2a26] rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#eca840]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.2em] mb-4">Logistical Destination</h3>
                        <p className="text-lg font-black text-white leading-relaxed italic">
                            "{selectedOrder.delivery_address || 'Collection from Artisanal Vault'}"
                        </p>
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                             <svg className="w-3.5 h-3.5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             Recorded at {new Date(selectedOrder.created_at).toLocaleTimeString()}
                          </span>
                          <span className="flex items-center gap-2">
                             <svg className="w-3.5 h-3.5 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                             {selectedOrder.payment_method?.toUpperCase() || 'COD'}
                          </span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                   {/* Personal Profile */}
                   <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 text-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-[#eca840]/20 p-1 mx-auto mb-6 shadow-xl relative group">
                          <img src={selectedOrder.buyer?.profile_image} alt="Buyer" className="w-full h-full object-cover rounded-[1.8rem]" />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#eca840] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                      </div>
                      <h4 className="text-lg font-black text-[#2d2a26]">{selectedOrder.buyer?.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedOrder.buyer?.email}</p>
                      <div className="mt-8 pt-8 border-t border-gray-200/50 space-y-4">
                         <div className="flex justify-between text-left">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Order Rank</span>
                            <span className="text-[10px] font-black text-[#eca840]">Priority Guild Member</span>
                         </div>
                         <div className="flex justify-between text-left">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Purchase</span>
                            <span className="text-xs font-black text-gray-900">₱{parseFloat(selectedOrder.total_amount || 0).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Financial Summary */}
                   <div className="bg-[#fcfaf7] border border-[#eca840]/10 rounded-[2rem] p-8">
                       <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Financial Ledger</h3>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase tracking-widest">
                             <span>Sub-Total</span>
                             <span>₱{parseFloat(selectedOrder.subtotal || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase tracking-widest font-outfit">
                             <span>Logistics</span>
                             <span className="text-[#eca840]">₱{parseFloat(selectedOrder.delivery_fee || 0).toLocaleString()}</span>
                          </div>
                          {parseFloat(selectedOrder.discount_amount || 0) > 0 && (
                             <div className="flex justify-between items-center text-xs font-black text-emerald-500 uppercase tracking-widest">
                                <span>Artisanal Offer</span>
                                <span>-₱{parseFloat(selectedOrder.discount_amount).toLocaleString()}</span>
                             </div>
                          )}
                          <div className="pt-6 border-t border-gray-200 mt-6 flex justify-between items-end">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Remittance</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">₱{parseFloat(selectedOrder.total_amount || 0).toLocaleString()}</span>
                             </div>
                             <div className="px-3 py-1 bg-[#1a1c23] text-[#eca840] text-[8px] font-black uppercase tracking-[0.2em] rounded-lg">PAID</div>
                          </div>
                       </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-8 lg:p-10 border-t border-gray-50 bg-gray-50/20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fulfillment Progress:</p>
                   <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                      selectedOrder.status === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                      selectedOrder.status === 'Pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-600 border-blue-500/20'
                   }`}>
                      {selectedOrder.status}
                   </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 md:flex-none px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all active:scale-95 shadow-sm"
                    >
                      Archive View
                    </button>
                    {selectedOrder.status !== 'Completed' && (
                        <button 
                          onClick={() => {
                            const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Completed'];
                            const nextIdx = (statuses.indexOf(selectedOrder.status) + 1) % statuses.length;
                            updateOrderStatus(selectedOrder.id, statuses[nextIdx]);
                            setIsModalOpen(false);
                          }}
                          className="flex-1 md:flex-none px-10 py-4 bg-[#2d2a26] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eca840] hover:shadow-xl hover:shadow-[#eca840]/20 transition-all border border-[#2d2a26] hover:border-[#eca840] active:scale-95"
                        >
                          Advance Fulfillment
                        </button>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}

const OrderStat = ({ label, value, change, changeType, showIcon }: any) => (
  <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 group flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${changeType === 'positive' ? 'bg-orange-50 text-[#eca840]' : 'bg-gray-50 text-gray-300'} group-hover:bg-[#2d2a26] group-hover:text-white shadow-inner`}>
        {showIcon === 'check' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
    </div>
    <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] truncate group-hover:text-gray-400 transition-colors">{label}</p>
            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md animate-in fade-in zoom-in duration-700 ${changeType === 'positive' ? 'bg-[#eca840] text-white shadow-sm shadow-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                {changeType === 'positive' ? '↗ TRENDING' : 'NEUTRAL'}
            </span>
        </div>
        <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight tabular-nums group-hover:text-[#eca840] transition-colors">
                {value}
            </h2>
            <span className="text-[9px] font-bold text-gray-400 truncate">{change}</span>
        </div>
    </div>
  </div>
);
