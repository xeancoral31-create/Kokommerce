import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

declare function route(name: string, params?: any): string;

interface OrderConfirmPayProps {
    cart_items: any[];
}

export default function OrderConfirmPay({ cart_items }: OrderConfirmPayProps) {
    const [paymentMethod, setPaymentMethod] = React.useState('gcash');

    const subtotal = cart_items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = 120;
    const total = subtotal + delivery;

    return (
        <BuyerLayout>
            <Head title="Confirm Payment - Kokommerce" />
            
            <div className="max-w-7xl mx-auto px-4 pb-32">
                <header className="mb-16">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                        <span className="text-gray-200">01. Selection</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-gray-200">02. Delivery</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-[#d4af37]">03. Payment</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic">
                        The Final <span className="text-[#d4af37]">Commitment.</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm text-balance">Review your artisanal selection and finalize the transaction.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Order Summary Recap */}
                        <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                             <div className="flex justify-between items-center mb-12">
                                <h2 className="text-3xl font-black tracking-tighter">Acquisition Summary</h2>
                                <span className="px-6 py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">4 Items</span>
                             </div>
                             
                             <div className="space-y-8">
                                {cart_items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-8 py-6 border-b border-gray-50 last:border-0 group">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                                            <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                        </div>
                                        <div className="flex-grow">
                                            <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest mb-1 block">Heirloom Selection</span>
                                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-400 font-medium italic mt-1">Quantity: {item.qty} Units</p>
                                        </div>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">₱{(item.price * item.qty).toLocaleString()}.00</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* Delivery Details Recap */}
                        <section className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-3xl font-black tracking-tighter">Logistics Destination</h2>
                                <Link 
                                    href={route('buyer.delivery')}
                                    className="text-[#d4af37] font-black text-[10px] tracking-[0.2em] uppercase hover:text-black transition-colors underline decoration-[#d4af37]/30 underline-offset-8"
                                >
                                    Edit Details
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-12">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Delivery Point</h4>
                                            <p className="font-bold text-gray-700 leading-relaxed italic">Unit 402, Amber Garden Residences, Salcedo Village, Makati City</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Receiver Contact</h4>
                                            <p className="font-bold text-gray-700 leading-relaxed italic">Elena Rodriguez <br/> <span className="text-gray-400 font-medium">+63 917 555 8899</span></p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-inner bg-gray-50 relative group">
                                     <div className="absolute inset-0 bg-[#2d2a26]/5 animate-pulse"></div>
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                         <div className="w-4 h-4 bg-[#d4af37] rounded-full shadow-2xl relative">
                                             <div className="absolute inset-0 bg-[#d4af37] rounded-full animate-ping opacity-30"></div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        {/* Final Payment Step */}
                        <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black mb-10 tracking-tight">Payment Method</h2>
                            <div className="space-y-4">
                                <button 
                                    onClick={() => setPaymentMethod('gcash')} 
                                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'gcash' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-[10px] text-white font-black italic shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">G</div>
                                        <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'gcash' ? 'text-black' : 'text-gray-400'}`}>GCash e-Wallet</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'gcash' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                        {paymentMethod === 'gcash' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => setPaymentMethod('card')} 
                                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'card' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 outline-none" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                                        </div>
                                        <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'card' ? 'text-black' : 'text-gray-400'}`}>Credit / Debit Card</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => setPaymentMethod('cod')} 
                                    className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'cod' ? 'border-[#d4af37] bg-[#fdfcf0]' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 002-2H4z" /><path d="M18 8a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h12z" /><path fillRule="evenodd" d="M9 11a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        </div>
                                        <span className={`font-black uppercase text-[10px] tracking-widest ${paymentMethod === 'cod' ? 'text-black' : 'text-gray-400'}`}>Cash on Delivery</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 p-[2px] transition-all flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#d4af37]' : 'border-gray-100'}`}>
                                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Final Commitment Box */}
                        <div className="bg-[#1a1a1a] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                             <div className="space-y-6 pb-12 border-b border-white/10">
                                 <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                                     <span>Subtotal Selection</span>
                                     <span className="text-white">₱{subtotal.toLocaleString()}.00</span>
                                 </div>
                                 <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                                     <span>Artisan Delivery</span>
                                     <span className="text-white">₱{delivery.toLocaleString()}.00</span>
                                 </div>
                             </div>
                             
                             <div className="py-12 flex justify-between items-end">
                                 <div>
                                     <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Grand Contribution</p>
                                     <p className="text-gray-400 text-[10px] font-medium leading-none italic">SECURE INVOICE</p>
                                 </div>
                                 <p className="text-5xl font-black tracking-tighter text-[#d4af37]">₱{total.toLocaleString()}.00</p>
                             </div>

                             <Link 
                                href={route('buyer.history')}
                                className="w-full py-7 bg-[#d4af37] text-[#1a1a1a] rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:-translate-y-1 transition-all shadow-xl shadow-[#d4af37]/20 group"
                             >
                                Confirm & Pay
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                             </Link>
                             
                             <p className="text-center text-[9px] text-white/20 mt-10 uppercase tracking-[0.2em] leading-relaxed">
                                By confirming, you legally agree to the terms of artisanal acquisition and hearth delivery.
                             </p>
                        </div>
                    </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
