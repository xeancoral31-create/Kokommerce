import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function BuyerDeliveryDetails() {
    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-[#2d2a26]">Set Delivery Point</h1>
                    <p className="text-gray-500 mt-2">Ensure your warm bakes reach the right hearth.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-2 space-y-12">
                         {/* Map Selection */}
                         <div className="relative">
                            <div className="map-placeholder h-[450px] rounded-[32px] shadow-sm">
                                <div className="absolute inset-0 bg-[#2d2a26]/5 rounded-[32px]"></div>
                            </div>
                            <div className="absolute bottom-10 inset-x-10">
                                <div className="buyer-card bg-white p-6 rounded-3xl flex items-center justify-between border-none shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-[#fff8e6] rounded-full flex items-center justify-center text-[#eca840]">
                                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pin Location</p>
                                            <p className="font-bold text-[#2d2a26]">24 Rue de la Boulangerie, Artisanal District</p>
                                        </div>
                                    </div>
                                    <button className="bg-[#eca840] text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#d6942f] transition-all">Change</button>
                                </div>
                            </div>
                         </div>

                         {/* Receiver Details Form */}
                         <section className="buyer-card p-12 bg-white">
                             <div className="flex items-center gap-4 mb-12">
                                 <div className="w-1.5 h-10 bg-[#eca840] rounded-full"></div>
                                 <h2 className="text-3xl font-black">Receiver Details</h2>
                             </div>
                             <form className="space-y-10">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                     <div className="space-y-4">
                                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Receiver Name</label>
                                         <input type="text" placeholder="Who's receiving the warm treats?" className="w-full bg-[#fdfaf5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-gold transition-all" />
                                     </div>
                                     <div className="space-y-4">
                                         <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Contact Number</label>
                                         <input type="tel" placeholder="+33 X XX XX XX XX" className="w-full bg-[#fdfaf5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-gold transition-all" />
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Floor / Unit / Landmark</label>
                                     <input type="text" placeholder="Apt 4B, 3rd Floor, near the old oak tree" className="w-full bg-[#fdfaf5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-gold transition-all" />
                                 </div>
                                 <div className="space-y-4">
                                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Special Delivery Instructions</label>
                                     <textarea rows={4} placeholder="Leave at the doorstep if no answer, ring the bell once..." className="w-full bg-[#fdfaf5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-gold transition-all resize-none"></textarea>
                                 </div>
                             </form>
                         </section>
                     </div>

                     {/* Sidebar: Summary and Action */}
                     <div className="space-y-8">
                         <div className="order-summary-box shadow-2xl">
                             <h2 className="font-black">Artisanal Basket</h2>
                             <div className="space-y-6">
                                 <div className="flex gap-4">
                                     <img src="https://images.unsplash.com/photo-1544333303-5775aa666d7e?auto=format&fit=crop&q=80&w=100" className="w-16 h-16 rounded-xl object-cover" alt="Item" />
                                     <div className="flex-grow">
                                         <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm leading-tight max-w-[120px]">Sourdough Croissants (3pcs)</h4>
                                            <span className="text-[#eca840] font-black">€12.50</span>
                                         </div>
                                         <p className="text-[10px] text-gray-500 mt-1">Flaky, buttery, stone-ground</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-4">
                                     <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=100" className="w-16 h-16 rounded-xl object-cover" alt="Item" />
                                     <div className="flex-grow">
                                         <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm leading-tight max-w-[120px]">Country Hearth Loaf</h4>
                                            <span className="text-[#eca840] font-black">€8.00</span>
                                         </div>
                                         <p className="text-[10px] text-gray-500 mt-1">Slow-fermented, wild yeast</p>
                                     </div>
                                 </div>
                             </div>

                             <div className="h-px bg-white/10 my-8"></div>

                             <div className="space-y-4">
                                 <div className="summary-row"><span>Subtotal</span> <span className="text-white">€20.50</span></div>
                                 <div className="summary-row"><span>Delivery Fee</span> <span className="text-white">€3.00</span></div>
                                 <div className="summary-row total pt-6">
                                     <span>Total</span>
                                     <span className="price">€23.50</span>
                                 </div>
                             </div>

                             <button className="w-full btn-buyer btn-buyer-gold py-5 mt-10 text-sm font-black shadow-xl">
                                Confirm & Pay
                             </button>
                             <p className="text-center text-[10px] text-gray-500 mt-6 font-bold uppercase tracking-widest">Warm hearth delivery in 35-45 mins</p>
                         </div>

                         <div className="p-8 bg-[#fdfaf5] border border-gray-100 rounded-3xl flex items-start gap-4 shadow-sm">
                             <div className="w-8 h-8 flex-shrink-0 text-[#eca840]">
                                 <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM10 16a1 1 0 100 2 1 1 0 000-2zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm2.464-4.95a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707z" clipRule="evenodd" /></svg>
                             </div>
                             <div>
                                 <h5 className="font-bold text-sm">Sustainable Packaging</h5>
                                 <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">All orders are delivered in compostable, plastic-free thermal wrap.</p>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
