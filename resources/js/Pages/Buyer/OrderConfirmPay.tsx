import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function OrderConfirmPay() {
    const [paymentMethod, setPaymentMethod] = React.useState('gcash');

    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <header className="mb-12">
                    <h1 className="text-6xl font-black text-[#2d2a26] leading-tight">Finalizing Your <br/> <span className="text-[#eca840]">Artisanal Choice</span></h1>
                    <p className="text-gray-500 mt-4 text-lg">Review your selections and delivery details before we fire up the oven for your order.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Order Summary */}
                        <section className="buyer-card p-12 bg-white">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black">Order Summary</h2>
                                <span className="bg-[#fff8e6] text-[#f2994a] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">2 Items</span>
                            </div>
                            <div className="space-y-10">
                                <div className="flex items-center gap-10">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-sm">
                                        <img src="https://images.unsplash.com/photo-1544333303-5775aa666d7e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Item" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold">Sourdough Croissants</h3>
                                        <p className="text-sm text-gray-400 mt-1">Fermented for 24 hours, organic butter layers.</p>
                                        <p className="text-xs font-black text-gray-500 mt-4 uppercase flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 17a2 2 0 002 2h8a2 2 0 002-2V7H4v10z" /></svg>
                                            Quantity: 4
                                        </p>
                                    </div>
                                    <p className="text-2xl font-black">₱480.00</p>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-sm">
                                        <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Item" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold">Country Hearth Loaf</h3>
                                        <p className="text-sm text-gray-400 mt-1">Whole grain stone-ground flour, thick chewy crust.</p>
                                        <p className="text-xs font-black text-gray-500 mt-4 uppercase flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 17a2 2 0 002 2h8a2 2 0 002-2V7H4v10z" /></svg>
                                            Quantity: 1
                                        </p>
                                    </div>
                                    <p className="text-2xl font-black">₱320.00</p>
                                </div>
                            </div>
                        </section>

                        {/* Delivery Details Recap */}
                        <section className="buyer-card p-12 bg-white">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black">Delivery Details</h2>
                                <button className="text-gold font-bold text-sm tracking-widest uppercase hover:underline">Edit Details</button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-12">
                                <div className="space-y-10 md:w-1/2">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Point</h4>
                                            <p className="font-bold text-[#2d2a26] mt-1">Unit 402, Amber Garden Residences, Salcedo Village, Makati City</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Receiver</h4>
                                            <p className="font-bold text-[#2d2a26] mt-1">Elena Rodriguez <br/> <span className="text-gray-400 font-medium">+63 917 555 8899</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                     <div className="map-placeholder h-48 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                         <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center">
                                             {/* Abstract Map UI Element */}
                                             <div className="w-full h-full bg-slate-100 relative opacity-50">
                                                 <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                                                 <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-10">
                        {/* Payment Method Selector */}
                        <div className="buyer-card p-10 bg-white">
                            <h2 className="text-2xl font-bold mb-8">Payment Method</h2>
                            <div className="space-y-4">
                                <div onClick={() => setPaymentMethod('gcash')} className={`payment-option ${paymentMethod === 'gcash' ? 'selected' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-black italic">GCash</div>
                                        <span className="font-bold text-sm">GCash e-Wallet</span>
                                    </div>
                                    <div className={`radio-circle ${paymentMethod === 'gcash' ? 'active' : ''}`}></div>
                                </div>
                                <div onClick={() => setPaymentMethod('card')} className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <svg className="w-8 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                                        <span className="font-bold text-sm text-gray-500">Credit / Debit Card</span>
                                    </div>
                                    <div className={`radio-circle ${paymentMethod === 'card' ? 'active' : ''}`}></div>
                                </div>
                                <div onClick={() => setPaymentMethod('cod')} className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <svg className="w-8 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 002-2H4z" /><path d="M18 8a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h12z" /><path fillRule="evenodd" d="M9 11a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        <span className="font-bold text-sm text-gray-500">Cash on Delivery</span>
                                    </div>
                                    <div className={`radio-circle ${paymentMethod === 'cod' ? 'active' : ''}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Total Bill & Finish */}
                        <div className="order-summary-box shadow-2xl p-10">
                             <div className="space-y-6">
                                 <div className="summary-row"><span>Subtotal</span> <span className="text-white">₱800.00</span></div>
                                 <div className="summary-row"><span>Delivery Fee</span> <span className="text-white">₱45.00</span></div>
                                 <div className="summary-row total border-none pt-10">
                                     <span className="font-black">Grand Total</span>
                                     <span className="text-4xl text-[#eca840] font-black">₱845.00</span>
                                 </div>
                             </div>

                             <button className="w-full btn-buyer btn-buyer-gold py-5 mt-12 text-sm font-black shadow-gold/20 shadow-xl uppercase tracking-widest">
                                Confirm & Pay
                             </button>
                             <p className="text-center text-[10px] text-gray-500 mt-6 leading-relaxed">By clicking, you agree to Kokommerce Terms of Service.</p>
                        </div>
                    </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
