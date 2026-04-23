import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';

interface ActivityProps {
  logs: any[];
  stats: {
    total_actions: number;
    inventory_syncs: number;
    order_updates: number;
    action_growth?: string;
    hourly_activity?: number[];
  };
}

export default function SellerActivity({ logs, stats }: ActivityProps) {
  const [filterText, setFilterText] = React.useState('');
  
  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => 
      log.username?.toLowerCase().includes(filterText.toLowerCase()) ||
      log.action?.toLowerCase().includes(filterText.toLowerCase()) ||
      log.category?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [logs, filterText]);

  const handleExportCSV = () => {
    const headers = ['User', 'Action', 'Category', 'Status', 'Time'];
    const rows = filteredLogs.map(log => [
      log.username,
      log.action,
      log.category,
      log.status,
      log.time + ' ' + (log.timestamp || '')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `kokommerce_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SellerLayout>
      <Head title="Audit Trail" />

      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 text-[#eca840]">Audit Trail</h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
             Complete history of administrative and automated actions within your storefront.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Filter logs..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#f5a623]/10 focus:border-[#f5a623] transition-all outline-none w-64 shadow-sm"
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#f5a623] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
           </div>
           <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-8 py-4 bg-[#f5a623] text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-[#f5a623]/30 transition-all uppercase tracking-widest leading-none shadow-lg shadow-orange-500/10"
           >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary Panel - Fully Connected */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <ActivityStatCard 
            label="Total Actions" 
            value={stats.total_actions.toLocaleString()} 
            change={stats.action_growth || "+0%"} 
            icon="actions" 
            color="#f5a623" 
            progress={Math.min(100, (stats.total_actions / 50) * 100)}
            status="ACTIVE"
          />
         <ActivityStatCard 
            label="Inventory Syncs" 
            value={stats.inventory_syncs.toString()} 
            change={stats.inventory_syncs > 0 ? "Detected" : "Stable"} 
            icon="sync" 
            color="#3b82f6" 
            progress={Math.min(100, (stats.inventory_syncs / 20) * 100)}
            status={stats.inventory_syncs > 0 ? "SYNCED" : "IDLE"}
          />
         <ActivityStatCard 
            label="Order Updates" 
            value={stats.order_updates.toString()} 
            change={stats.order_updates > 0 ? "Real-time" : "Live"} 
            icon="orders" 
            color="#8b5cf6" 
            progress={Math.min(100, (stats.order_updates / 30) * 100)}
            status={stats.order_updates > 0 ? "LIVE" : "WAITING"}
          />
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-16">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-50">
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Time</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                 <LogEntry key={i} log={log} />
               )) : (
                 <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                       <p className="text-gray-400 font-bold">No activity logs found matching your filter.</p>
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
         <div className="px-10 py-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredLogs.length} of {stats.total_actions} activities</span>
            <div className="flex gap-4">
               <button className="px-6 py-2 rounded-xl border border-gray-100 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all">Previous</button>
               <button className="px-6 py-2 rounded-xl border border-gray-100 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all">Next</button>
            </div>
         </div>
      </div>


    </SellerLayout>
  );
}

const ActivityStatCard = ({ label, value, change, icon, color, progress, status }: any) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
     <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}10`, color }}>
           {icon === 'actions' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
           {icon === 'sync' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H5" /></svg>}
           {icon === 'orders' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-black uppercase tracking-widest ${change?.includes('+') ? 'text-green-500' : 'text-gray-400'}`}>{status || 'STABLE'}</span>
          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">CURRENT STATUS</span>
        </div>
     </div>
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
     <div className="flex items-end gap-3">
        <h2 className="text-4xl font-black text-gray-900">{value}</h2>
        <div className="h-1.5 flex-1 bg-gray-50 rounded-full mb-3 overflow-hidden">
           <div className="h-full bg-current opacity-60 rounded-full transition-all duration-1000" style={{ width: `${progress || 0}%`, color }}></div>
        </div>
     </div>
     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
        <span className={change?.includes('+') ? 'text-green-500' : ''}>{change}</span>
        <span>vs last period</span>
     </p>
  </div>
);

const LogEntry = ({ log }: any) => (
  <tr className="group hover:bg-gray-50/50 transition-all">
    <td className="px-10 py-8">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#fcf5eb] flex items-center justify-center text-[#eca840] font-black text-xs">
             {log.username.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
             <h4 className="text-sm font-bold text-gray-900">{log.username}</h4>
             <p className="text-[10px] text-gray-400 font-bold">{log.email || log.role || 'Administrator'}</p>
          </div>
       </div>
    </td>
    <td className="px-10 py-8">
       <h4 className="text-sm font-bold text-gray-800 mb-1">{log.action}</h4>
       <p className="text-[10px] text-gray-400 font-medium">{log.details}</p>
    </td>
    <td className="px-10 py-8">
       <span className="bg-gray-50 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-100">{log.category}</span>
    </td>
    <td className="px-10 py-8">
       <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-green-500' : (log.status === 'processing' ? 'bg-blue-500' : 'bg-orange-500')}`}></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'success' ? 'text-green-500' : (log.status === 'processing' ? 'text-blue-500' : 'text-orange-500')}`}>
             {log.status}
          </span>
       </div>
    </td>
    <td className="px-10 py-8 text-right">
       <h4 className="text-sm font-bold text-gray-900 mb-1">{log.time}</h4>
       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.timestamp}</p>
    </td>
  </tr>
);
