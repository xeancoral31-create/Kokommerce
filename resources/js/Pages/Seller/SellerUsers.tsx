import React from 'react';
import SellerLayout from '../../Components/SellerLayout';
import { Head } from '@inertiajs/inertia-react';

interface UsersProps {
  users: any[];
  stats: {
    total_members: number;
    active_now: number;
    permissions_audit: string;
  };
}

export default function SellerUsers({ users, stats }: UsersProps) {
  const [activeMenu, setActiveMenu] = React.useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState('All Users');

  const filteredUsers = React.useMemo(() => {
    if (selectedRole === 'All Users') return users;
    if (selectedRole === 'Staff Partner') return users.filter(u => u.role === 'Seller');
    if (selectedRole === 'Customer') return users.filter(u => u.role === 'Buyer');
    return users;
  }, [users, selectedRole]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Role,Status,Joined,Orders"].join(",") + "\n"
      + users.map(u => `${u.name},${u.role},${u.status},${u.joined},${u.orders}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kokommerce_users_audit.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUserAction = (userId: number, action: string) => {
    alert(`Action "${action}" triggered for user ID: ${userId}. In a production environment, this would perform a secure backend operation.`);
    setActiveMenu(null);
  };

  return (
    <SellerLayout>
      <Head title="User Management" />

      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Expand Your Team</h1>
          <div className="flex items-center gap-4">
             <span className="bg-orange-50 text-[#eca840] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                +12.5% community growth
             </span>
             <span className="text-gray-400 font-bold text-sm">since last month</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
         <UserStatCard label="Total Members" value={stats.total_members.toLocaleString()} />
         <UserStatCard label="Active Now" value={stats.active_now.toString()} />
         <div className="lg:col-span-2 bg-[#f5a623] rounded-[3rem] p-10 text-white flex flex-col justify-center">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-3">Permissions Audit</p>
            <h2 className="text-6xl font-black text-white">{stats.permissions_audit}</h2>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mb-16">
         <div className="px-12 py-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
            <h3 className="text-2xl font-black text-gray-900">Staff & Customers</h3>
            <div className="flex gap-4 relative">
               <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-3 rounded-xl transition-all ${isFilterOpen ? 'bg-[#eca840] text-white' : 'text-gray-400 hover:bg-white hover:shadow-md'}`}
               >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
               </button>
               <button 
                  onClick={handleExport}
                  className="p-3 text-gray-400 hover:text-[#eca840] hover:bg-white hover:shadow-md rounded-xl transition-all"
               >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               </button>

               {isFilterOpen && (
                  <div className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Filter By Role</p>
                     <div className="space-y-1">
                        {['All Users', 'Staff Partner', 'Customer'].map(filter => (
                           <button 
                              key={filter} 
                              onClick={() => {
                                 setSelectedRole(filter);
                                 setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-[10px] font-bold rounded-lg transition-all ${selectedRole === filter ? 'bg-[#eca840] text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-[#eca840]'}`}
                           >
                              {filter}
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-gray-50">
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User</th>
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Orders</th>
                  <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user: any) => (
                  <UserRow 
                    key={user.id}
                    id={user.id}
                    name={user.name} 
                    image={user.image}
                    role={user.role} 
                    status={user.status} 
                    joined={user.joined} 
                    orders={user.orders} 
                    isMenuOpen={activeMenu === user.id}
                    onMenuToggle={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    onAction={(action: string) => handleUserAction(user.id, action)}
                  />
               ))}
            </tbody>
         </table>
      </div>

    </SellerLayout>
  );
}

const UserStatCard = ({ label, value }: any) => (
  <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-center">
     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{label}</p>
     <h2 className="text-6xl font-black text-gray-900">{value}</h2>
  </div>
);

const UserRow = ({ id, name, image, role, status, joined, orders, isMenuOpen, onMenuToggle, onAction }: any) => (
  <tr className="group hover:bg-gray-50/50 transition-all">
     <td className="px-12 py-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-110 bg-[#2d2a26] flex items-center justify-center flex-shrink-0">
               <span className="text-white text-lg font-black uppercase leading-none">
                  {name?.split(' ')[0]?.[0] || '?'}
               </span>
            </div>
            <span className="text-lg font-bold text-gray-900">{name}</span>
         </div>
     </td>
      <td className="px-12 py-8">
        <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-widest ${role === 'Seller' ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-white border-gray-200 text-gray-400'}`}>
           {role === 'Seller' ? 'Staff Partner' : 'Customer'}
        </span>
      </td>
     <td className="px-12 py-8">
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-300'}`}></div>
           <span className={`text-xs font-bold ${status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>{status}</span>
        </div>
     </td>
     <td className="px-12 py-8 text-sm font-bold text-gray-500">{joined}</td>
     <td className="px-12 py-8 text-lg font-black text-gray-900">{orders}</td>
     <td className="px-12 py-8 text-right relative">
        <button 
          onClick={onMenuToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMenuOpen ? 'bg-[#2d2a26] text-white shadow-lg rotate-90' : 'text-gray-300 hover:bg-white hover:text-gray-900 hover:shadow-md'}`}
        >
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
        </button>

        {isMenuOpen && (
           <div className="absolute right-24 top-1/2 -translate-y-1/2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] p-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <button onClick={() => onAction('Edit')} className="w-full text-left px-4 py-2.5 text-[10px] font-black text-gray-600 hover:bg-orange-50 hover:text-[#eca840] rounded-xl transition-all uppercase tracking-widest">Edit Profile</button>
              <button onClick={() => onAction('Permissions')} className="w-full text-left px-4 py-2.5 text-[10px] font-black text-gray-600 hover:bg-orange-50 hover:text-[#eca840] rounded-xl transition-all uppercase tracking-widest">Permissions</button>
              <div className="my-1 border-t border-gray-50"></div>
              <button onClick={() => onAction('Delete')} className="w-full text-left px-4 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest">Remove User</button>
           </div>
        )}
     </td>
  </tr>
);

