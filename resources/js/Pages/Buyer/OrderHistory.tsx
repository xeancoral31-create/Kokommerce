import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head } from '@inertiajs/inertia-react';

interface OrderHistoryProps {
    orders: any[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
    const formatItems = (orderItems: any[]) => {
        if (!orderItems || orderItems.length === 0) return "No items recorded";
        return orderItems.map(item => {
            const name = item.product?.name || "Unknown Product";
            return item.quantity > 1 ? `${item.quantity}x ${name}` : name;
        }).join(', ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <BuyerLayout>
            <Head title="Order Archives - Kokommerce" />
            
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Order <span>Archives.</span></h1>
                    <p className="text-gray-400 font-bold text-lg max-w-xl leading-relaxed">
                        A definitive chronicle of your culinary journeys and artisanal acquisitions.
                    </p>
                </div>
            </header>

            <div className="overflow-x-auto bg-white rounded-[3rem] border border-gray-100 shadow-sm p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ORDER REFERENCE</th>
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">DATE</th>
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ITEMS PURCHASED</th>
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">TOTAL AMOUNT</th>
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                            <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-10 font-black text-gray-900 tracking-tighter">#KKO-{order.id.toString().padStart(4, '0')}</td>
                                    <td className="px-8 py-10 text-gray-500 font-medium">{formatDate(order.created_at)}</td>
                                    <td className="px-8 py-10">
                                        <div className="max-w-xs truncate text-gray-700 font-bold italic" title={formatItems(order.order_items)}>
                                            {formatItems(order.order_items)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-10 font-black text-gray-900">₱{parseFloat(order.total_amount).toLocaleString()}</td>
                                    <td className="px-8 py-10">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                            order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                            order.status === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                            'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-10">
                                        <button className="text-[#d4af37] font-black text-[10px] uppercase tracking-widest hover:text-black transition-colors underline decoration-[#d4af37]/30 underline-offset-4">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 text-gray-300">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        <p className="text-sm font-black uppercase tracking-widest">No orders found in your archive.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </BuyerLayout>
    );
}
