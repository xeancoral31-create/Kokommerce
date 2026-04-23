import React, { useState } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head } from '@inertiajs/inertia-react';

interface OrderHistoryProps {
    orders: any[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
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
                                            order.status.toLowerCase() === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                            'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-10">
                                        <button 
                                            onClick={() => openDetails(order)}
                                            className="text-[#d4af37] font-black text-[10px] uppercase tracking-widest hover:text-black transition-colors underline decoration-[#d4af37]/30 underline-offset-4"
                                        >
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

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
                        <div className="p-12 overflow-y-auto scrollbar-hide">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Reference: #KKO-{selectedOrder.id.toString().padStart(4, '0')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Status</p>
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border inline-block ${
                                        selectedOrder.status.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                        selectedOrder.status.toLowerCase() === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                    }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Date</p>
                                    <p className="text-gray-900 font-black">{formatDate(selectedOrder.created_at)}</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Items Purchased</p>
                                <div className="space-y-4">
                                    {selectedOrder.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-3xl group hover:border-[#d4af37]/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center font-black text-[#d4af37]">
                                                    {item.quantity}x
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 tracking-tight">{item.product?.name || "Artisanal Creation"}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Crafted Batch</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-gray-900 italic">₱{parseFloat(item.price).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
                                        <p className="text-gray-900 font-black flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            {selectedOrder.payment_method || 'Cash on Delivery'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Address</p>
                                        <p className="text-gray-600 font-bold italic leading-relaxed">
                                            {selectedOrder.delivery_address || 'Collection at Artisan Hub'}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span>₱{parseFloat(selectedOrder.subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Delivery</span>
                                            <span>₱{parseFloat(selectedOrder.delivery_fee || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                                            <span className="text-xs font-black uppercase text-[#d4af37]">Total</span>
                                            <span className="text-2xl font-black italic">₱{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </BuyerLayout>
    );
}
