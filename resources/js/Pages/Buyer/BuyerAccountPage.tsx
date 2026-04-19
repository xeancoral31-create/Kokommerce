import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function BuyerAccountPage() {
    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto pb-20">
                {/* Hero Header Selection */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                    <div className="flex-grow">
                        <span className="bg-[#eca840]/10 text-[#eca840] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Artisan Member</span>
                        <h1 className="text-6xl font-black text-[#2d2a26] leading-tight mb-6">Welcome home, <br/> <span className="text-[#eca840]">Elena Santos</span></h1>
                        <p className="text-gray-500 text-lg max-w-md leading-relaxed">Manage your artisanal preferences, saved locations, and payments from your personal hearth.</p>
                    </div>
                    <div className="relative w-full md:w-[450px]">
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1572381772749-da6dec4249a0?auto=format&fit=crop&q=80&w=600" alt="Sapin Sapin" className="w-full h-full object-cover" />
                             <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <h3 className="font-bold text-xl">Today's Fresh Batch</h3>
                                <p className="text-sm opacity-80 mt-1">Sapin-Sapin layered with love</p>
                             </div>
                        </div>
                        <button className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#eca840] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-2 space-y-12">
                         {/* Personal Information */}
                         <section className="buyer-card p-10 bg-white">
                             <div className="flex justify-between items-center mb-10">
                                 <h2 className="text-2xl font-bold">Personal Information</h2>
                                 <button className="text-gray-400 font-bold text-sm tracking-wider flex items-center gap-2 hover:text-gold transition-colors italic">Edit ✎</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                     <p className="text-lg font-bold">Elena Santos-Cruz</p>
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                     <p className="text-lg font-bold">elena.s@artisangrain.ph</p>
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                     <p className="text-lg font-bold">+63 917 555 0123</p>
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</label>
                                     <p className="text-lg font-bold">October 2023</p>
                                 </div>
                             </div>
                         </section>

                         {/* Delivery Addresses */}
                         <section className="buyer-card p-10 bg-white">
                             <div className="flex justify-between items-center mb-10">
                                 <h2 className="text-2xl font-bold">Delivery Addresses</h2>
                                 <button className="bg-[#fff8e6] text-[#f2994a] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">+ Add New</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="p-6 rounded-2xl bg-[#fdfaf5] border border-gray-100 flex gap-4">
                                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#eca840]">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                     </div>
                                     <div>
                                         <h4 className="font-bold">Home</h4>
                                         <p className="text-xs text-gray-500 leading-relaxed mt-1">123 Molave Ridge, Salcedo Village, Makati City, 1227</p>
                                     </div>
                                 </div>
                                 <div className="p-6 rounded-2xl bg-[#fdfaf5] border border-gray-100 flex gap-4">
                                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-gray-500">Work</h4>
                                         <p className="text-xs text-gray-400 leading-relaxed mt-1">Level 24, Trade Tower, Bonifacio Global City, Taguig</p>
                                     </div>
                                 </div>
                             </div>
                         </section>
                     </div>

                     <div className="space-y-12">
                          {/* Artisan Tip Card */}
                          <div className="bg-[#1a1e23] border-none rounded-[32px] p-10 text-white relative overflow-hidden">
                               <div className="w-12 h-12 bg-[#eca840] rounded-full flex items-center justify-center mb-8">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 01-.22-.1.989.989 0 01-.064-.044C5.244 6.225 5 5.755 5 5.385c0-.601.439-1.104 1-1.217.06-.013.12-.019.184-.018l.1.009a.993.993 0 01.353.136c.219.136.368.351.413.585.045.234.004.476-.118.681-.122.204-.326.347-.565.395a.994.994 0 01-.483-.005.992.992 0 01-.132.067.994.994 0 01-.284.153.992.992 0 01-.184.009zM14.116 6.607a1 1 0 01.22-.1.989.989 0 01.064-.044C14.756 6.225 15 5.755 15 5.385c0-.601-.439-1.104-1-1.217a1.001 1.001 0 00-.184-.018l-.1.009a.993.993 0 00-.353.136c-.219.136-.368.351-.413.585-.045.234-.004.476.118.681.122.204.326.347.565.395a.994.994 0 00.483-.005.992.992 0 00.132.067c.09.043.187.094.284.153a.992.992 0 00.184.009zM10 5a5 5 0 00-4 8v1a1 1 0 001 1h6a1 1 0 001-1v-1a5 5 0 00-4-8z" /></svg>
                               </div>
                               <h3 className="text-2xl font-bold mb-4">Artisan Freshness Tip</h3>
                               <p className="text-gray-400 text-sm leading-relaxed mb-8">To maintain the perfect moisture of your ube pastries, store them in a cool, airtight ceramic container rather than plastic. Let them breathe for 5 minutes before serving for full flavor profile.</p>
                               <button className="text-[#eca840] font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">Read more tips →</button>
                               {/* Decorative Element */}
                               <div className="absolute top-0 right-0 w-32 h-32 bg-[#eca840]/5 rounded-full -mr-16 -mt-16"></div>
                          </div>

                          {/* Payment Methods */}
                          <section className="buyer-card p-10 bg-white">
                               <h2 className="text-2xl font-bold mb-10">Payment Methods</h2>
                               <div className="space-y-4">
                                   <div className="payment-option selected">
                                       <div className="flex items-center gap-4">
                                            <div className="w-10 h-6 bg-blue-600 rounded-sm"></div>
                                            <span className="font-bold text-sm">•••• 8821</span>
                                            <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-bold">Primary</span>
                                       </div>
                                       <div className="radio-circle active"></div>
                                   </div>
                                   <div className="payment-option">
                                       <div className="flex items-center gap-4">
                                            <div className="w-10 h-6 bg-gray-100 rounded-sm flex items-center justify-center font-black text-[8px] text-gray-400">GCash</div>
                                            <span className="font-bold text-sm text-gray-500">GCash Wallet</span>
                                       </div>
                                       <div className="radio-circle"></div>
                                   </div>
                                   <button className="btn-buyer btn-buyer-outline w-full mt-6 py-4 text-sm bg-gray-100/50 border-none">Manage Wallet</button>
                               </div>
                          </section>
                     </div>
                </div>

                {/* Bottom Section: Journey */}
                <div className="mt-20 buyer-card bg-white p-0 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                     <div className="md:w-1/3">
                         <img src="https://images.unsplash.com/photo-1544333303-5775aa666d7e?auto=format&fit=crop&q=80&w=600" alt="Baking Process" className="w-full h-full object-cover" />
                     </div>
                     <div className="md:w-2/3 p-20 flex flex-col justify-center">
                         <h2 className="text-5xl font-black mb-10 text-[#2d2a26]">Your Artisanal <br/> <span className="text-[#eca840]">Journey</span></h2>
                         <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mb-12">
                             You've enjoyed <span className="text-gold font-bold">14 fresh batches</span> this year. Your most ordered item is the <span className="text-[#2d2a26] font-bold">Classic Ube Halaya Ensaymada</span>. We're currently curing a special batch of salted egg bibingka just for your next visit.
                         </p>
                         <div className="flex gap-8">
                             <div className="bg-[#fdfaf5] p-6 rounded-3xl min-w-[160px]">
                                 <p className="text-3xl font-black text-[#2d2a26]">2.4k</p>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Grain Points</p>
                             </div>
                             <div className="bg-[#fdfaf5] p-6 rounded-3xl min-w-[160px]">
                                 <p className="text-3xl font-black text-[#eca840]">Silver</p>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Hearth Status</p>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
