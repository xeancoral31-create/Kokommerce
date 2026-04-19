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
        <button className="flex items-center gap-3 px-10 py-6 bg-[#f5a623] text-white rounded-[2rem] text-sm font-black hover:shadow-2xl hover:shadow-[#f5a623]/30 transition-all uppercase tracking-[0.15em] leading-none">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add New User
        </button>
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
            <div className="flex gap-6">
               <button className="p-2 text-gray-400 hover:text-gray-600 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
               </button>
               <button className="p-2 text-gray-400 hover:text-gray-600 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               </button>
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
               <UserRow name="Marco" role="Admin" status="Active" joined="Oct 12, 2023" orders="--" />
               <UserRow name="Elena" role="Manager" status="Active" joined="Jan 05, 2024" orders="--" />
               <UserRow name="Silas" role="Customer" status="Inactive" joined="Mar 18, 2024" orders="12" />
               <UserRow name="Aria" role="Customer" status="Active" joined="Apr 02, 2024" orders="34" />
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

const UserRow = ({ name, role, status, joined, orders }: any) => (
  <tr className="group hover:bg-gray-50/50 transition-all">
     <td className="px-12 py-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
              <img src={`https://i.pravatar.cc/100?u=${name}`} alt={name} />
           </div>
           <span className="text-lg font-bold text-gray-900">{name}</span>
        </div>
     </td>
     <td className="px-12 py-8">
        <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-widest ${role === 'Admin' ? 'bg-orange-50 border-orange-100 text-orange-500' : (role === 'Manager' ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white border-gray-200 text-gray-400')}`}>
           {role}
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
     <td className="px-12 py-8 text-right">
        <button className="text-gray-300 hover:text-gray-900 font-bold transition-all">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
        </button>
     </td>
  </tr>
);

