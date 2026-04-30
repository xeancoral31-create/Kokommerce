import React, { useState } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface OrderHistoryProps {
    orders: any[];
    flash?: {
        success?: string;
    };
}

export default function OrderHistory({ orders, flash }: OrderHistoryProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(!!flash?.success);

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

    const formatPaymentMethod = (method: string | null | undefined) => {
        if (!method) return 'COD (Cash-on-Delivery)';
        const m = method.toLowerCase();
        if (m === 'gcash') return 'GCash';
        if (m === 'maya' || m === 'paymaya') return 'PayMaya';
        if (m === 'card') return 'Credit Card (Card Payment)';
        if (m === 'cod') return 'COD (Cash-on-Delivery)';
        return method.charAt(0).toUpperCase() + method.slice(1);
    };

    const openDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <BuyerLayout>
            <Head title="Order Archives - Kokommerce" />
            
            {showSuccess && (
                <div className="mb-12 animate-in slide-in-from-top-4 fade-in duration-700">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-400/10 transition-colors duration-1000"></div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-emerald-900 tracking-tight">{flash?.success || 'Order Secured!'}</h3>
                                <p className="text-emerald-700/70 text-sm font-medium italic">Your artisanal acquisition has been recorded in the guild archives.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.1em] hover:bg-emerald-700 transition-all relative z-10 shadow-md shadow-emerald-200 active:scale-95"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}

            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 italic">Order <span className="text-[#d4af37]">History.</span></h1>
                    <p className="text-gray-400 font-medium text-sm max-w-xl leading-relaxed italic">
                        A list of your previous orders and purchases.
                    </p>
                </div>
            </header>

            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-0">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ORDER NUMBER</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">DATE</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ITEMS</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">TOTAL AMOUNT</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">#KKO-{order.id.toString().padStart(4, '0')}</td>
                                    <td className="px-6 py-4 text-gray-500 font-medium text-sm">{formatDate(order.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-gray-700 font-medium text-sm italic" title={formatItems(order.order_items || order.orderItems)}>
                                            {formatItems(order.order_items || order.orderItems)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">₱{parseFloat(order.total_amount).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border inline-block ${
                                            order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                            order.status.toLowerCase() === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                            'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openDetails(order)}
                                            className="text-[#d4af37] font-bold text-xs hover:text-black transition-colors underline decoration-[#d4af37]/30 underline-offset-4"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-6 text-gray-300">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                            <svg className="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">No orders yet.</p>
                                            <p className="text-gray-400 font-medium text-sm italic">You haven't made any purchases yet.</p>
                                        </div>
                                        <a 
                                            href={route('buyer.shop')}
                                            className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#d4af37] transition-all shadow-md mt-2"
                                        >
                                            Start Shopping
                                        </a>
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
                    
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                        <div className="p-8 overflow-y-auto scrollbar-hide">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Details</h2>
                                    <p className="text-gray-500 font-medium text-xs mt-1">Reference: #KKO-{selectedOrder.id.toString().padStart(4, '0')}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Status</p>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border inline-block ${
                                        selectedOrder.status.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                        selectedOrder.status.toLowerCase() === 'pending' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                                        'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                    }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Date</p>
                                    <p className="text-gray-900 font-bold text-sm">{formatDate(selectedOrder.created_at)}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Items Purchased</p>
                                <div className="space-y-3">
                                    {(selectedOrder.order_items || selectedOrder.orderItems)?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center font-bold text-[#d4af37] text-sm">
                                                    {item.quantity}x
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{item.product?.name || "Artisanal Creation"}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.variant ? item.variant : "Crafted Batch"}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">₱{parseFloat(item.price).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</p>
                                        <p className="text-gray-900 font-bold text-sm flex items-center gap-3">
                                            {selectedOrder.payment_method?.toLowerCase() === 'card' ? (
                                                <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                                            ) : selectedOrder.payment_method?.toLowerCase() === 'cod' ? (
                                                <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            )}
                                            {formatPaymentMethod(selectedOrder.payment_method)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                                        <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                            {selectedOrder.delivery_address || 'Collection at Store'}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-900 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                    
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex justify-between text-xs font-medium text-gray-400">
                                            <span>Subtotal</span>
                                            <span>₱{parseFloat(selectedOrder.subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-gray-400">
                                            <span>Delivery</span>
                                            <span>₱{parseFloat(selectedOrder.delivery_fee || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-800 flex justify-between items-end mt-2">
                                            <span className="text-xs font-bold text-[#d4af37]">Total</span>
                                            <span className="text-lg font-bold">₱{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
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
