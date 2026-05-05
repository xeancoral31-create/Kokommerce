import React from "react";
import { usePage } from '@inertiajs/inertia-react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import CountdownTimer from '../Components/CountdownTimer';
import { Truck } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  discount_value: number;
  image: string | null;
  end_date: string | null;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

export default function Offer({ promotions }: { promotions: Promotion[] }) {
  const [expiredIds, setExpiredIds] = React.useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    promotions.forEach(p => {
       if (p.end_date && new Date(p.end_date) < new Date()) {
         initial[p.id] = true;
       }
    });
    return initial;
  });

  const handleExpire = (id: number) => {
    setExpiredIds(prev => ({ ...prev, [id]: true }));
  };

  const getPrice = (promo: Promotion) => {
    if (!promo.product) return 0;
    if (promo.type === 'percentage') {
      return promo.product.price * (1 - promo.discount_value / 100);
    }
    return promo.product.price - promo.discount_value;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]/80 dark:bg-gray-950 transition-colors duration-500 pt-20">
      <Navbar />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none z-0"></div>
      
      <main className="flex-grow relative z-10">
        <div className="container mx-auto px-6 md:px-12 py-12">
          
          {/* Seasonal Special Hero - Latest Promotion */}
          {promotions.length > 0 && (
            <section className="mb-24">
              <div className="rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-[600px]">
                <div className="bg-[#1c1917] text-white p-12 md:p-24 w-full md:w-3/5 flex flex-col justify-center items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#eca840]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                  
                  <span className="bg-[#eca840] text-white text-[10px] font-black px-6 py-2.5 rounded-2xl mb-12 uppercase tracking-[0.4em] shadow-2xl shadow-orange-950/20">
                    Grand Invitation
                  </span>
                  
                  <h1 className="text-6xl md:text-8xl font-[1000] mb-8 leading-[0.85] tracking-tighter italic text-[#eca840]">
                    {promotions[0].title}
                  </h1>
                  
                  <p className="text-gray-400 mb-14 max-w-md leading-relaxed text-lg font-medium opacity-80">
                    {promotions[0].description}
                  </p>
                  
                  <div className="flex flex-col gap-12 w-full">
                    {promotions[0].product && (
                      <div className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md group/prod cursor-default">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group-hover/prod:scale-110 transition-transform duration-700">
                          <img src={promotions[0].product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#eca840]/60 uppercase tracking-[0.4em] mb-2">Curated Piece</span>
                          <h4 className="text-xl font-black text-white leading-tight">{promotions[0].product.name}</h4>
                          <div className="flex items-baseline gap-3 mt-3">
                             <span className="text-3xl font-black text-white tracking-tighter">₱{getPrice(promotions[0]).toLocaleString()}</span>
                             <span className="text-sm font-bold text-white/20 line-through">₱{Number(promotions[0].product.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center w-full">
                      <div className="group relative">
                        <div className="absolute -inset-8 bg-[#eca840]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative px-20 py-10 bg-[#151311] border border-white/5 rounded-[2.5rem] flex flex-col items-center shadow-2xl">
                          <span className="text-[10px] tracking-[0.5em] text-white/30 mb-4 font-black uppercase">Invitation Code</span>
                          <span className="text-[#eca840] font-[1000] tracking-[0.6em] uppercase text-3xl">
                            {promotions[0].code}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-12 border-t border-white/[0.05] w-full">
                      <CountdownTimer 
                        endDate={promotions[0].end_date} 
                        onExpire={() => handleExpire(promotions[0].id)}
                        className="flex flex-col items-center md:items-start"
                        labelClassName="text-[10px] font-black text-[#eca840]/40 uppercase tracking-[0.5em] mb-4"
                        timeClassName="text-4xl font-[1000] text-white tabular-nums tracking-widest drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#fdfbf7] w-full md:w-2/5 flex items-center justify-center relative p-16 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,168,64,0.05),transparent)] pointer-events-none"></div>
                  <img 
                    src={promotions[0].image || (promotions[0].product?.image) || "/images/placeholder-artisanal.png"} 
                    alt={promotions[0].title} 
                    className="relative w-full h-full max-h-[500px] object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Additional Offers Section */}
          <section className="mb-32">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="relative">
                <span className="text-[#eca840] text-[10px] font-black uppercase tracking-[0.5em] block mb-5">Private Archive</span>
                <h2 className="text-5xl md:text-7xl font-[1000] text-[#1c1917] tracking-tighter leading-none italic">
                  Active Bounties
                </h2>
              </div>
              <p className="text-stone-400 max-w-xs text-xs font-bold leading-relaxed tracking-widest uppercase opacity-60 text-right">
                Limited temporal opportunities curated for refined tastes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {promotions.slice(1).map((promo) => {
                const isExpired = expiredIds[promo.id];
                return (
                  <div 
                    key={promo.id} 
                    className="group flex flex-col bg-white dark:bg-gray-900 rounded-[3.5rem] border border-stone-100/60 dark:border-gray-800 overflow-hidden hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-4"
                  >
                    <div className="relative h-80 overflow-hidden bg-[#fcfaf7]">
                      <img 
                        src={promo.image || (promo.product?.image) || "/images/placeholder-artisanal.png"} 
                        alt={promo.title} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute top-8 left-8 z-20">
                        <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${isExpired ? 'bg-red-500 text-white' : 'bg-[#1c1917]/90 text-white'}`}>
                          {isExpired ? 'Expired' : (promo.type === 'percentage' ? `${promo.discount_value}% Off` : `₱${promo.discount_value} Savings`)}
                        </span>
                      </div>
                    </div>

                    <div className="p-12 flex flex-col flex-grow relative">
                      <h3 className="text-3xl font-[1000] text-[#1c1917] mb-4 tracking-tighter leading-tight italic group-hover:text-[#eca840] transition-colors duration-500 pr-10">
                        {promo.title}
                      </h3>
                      <p className="text-stone-400 text-sm mb-12 line-clamp-2 font-medium leading-relaxed">
                        {promo.description}
                      </p>

                      <div className="mt-auto space-y-10">
                        <div className="border-t border-stone-50 pt-10 flex flex-col">
                          <span className="text-[9px] font-black text-[#eca840]/60 uppercase tracking-[0.4em] mb-3">Refined Value</span>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-[1000] text-[#1c1917] tracking-tighter italic">
                              ₱{getPrice(promo).toLocaleString()}
                            </span>
                            {promo.product && (
                              <span className="text-xs font-bold text-stone-300 line-through">₱{promo.product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-6">
                          <div className="flex justify-center">
                            <div className="bg-stone-50 px-8 py-5 rounded-3xl border border-stone-100 text-[14px] font-black text-[#1c1917] tracking-[0.4em] uppercase shadow-inner">
                              {promo.code}
                            </div>
                          </div>

                          <div className="bg-[#fcfaf7] p-6 rounded-[2.5rem] border border-stone-100/50">
                            <CountdownTimer 
                              endDate={promo.end_date} 
                              onExpire={() => handleExpire(promo.id)}
                              className="flex flex-col items-center"
                              labelClassName="text-[8px] font-black text-[#eca840]/50 uppercase tracking-[0.5em] mb-2"
                              timeClassName={`text-lg font-black tabular-nums tracking-widest ${isExpired ? 'text-red-400' : 'text-[#1c1917]'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Delivery banner */}
          <div className="bg-[#1c1917] rounded-[3.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#eca840]/5 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out"></div>
            <div className="flex items-center mb-8 md:mb-0 relative z-10">
               <div className="w-16 h-16 bg-[#eca840]/10 rounded-full flex items-center justify-center text-[#eca840] shadow-2xl mr-8 flex-shrink-0 border border-white/5">
                  <Truck className="w-7 h-7" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-white tracking-tight mb-2">Artisanal Direct Shipping</h4>
                  <p className="text-white/40 text-sm font-medium tracking-wide">All curated collections ship via our specialized temperature-controlled vault.</p>
               </div>
            </div>
            <p className="text-3xl font-[1000] text-[#eca840] italic tracking-tighter relative z-10">#KokommerceVault</p>
          </div>

          {promotions.length === 0 && (
            <div className="py-40 text-center">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-stone-50 dark:border-gray-700">
                <Truck className="w-10 h-10 text-stone-200" />
              </div>
              <h3 className="text-4xl font-[1000] text-[#1c1917] tracking-tighter italic">Restocking Bounties</h3>
              <p className="text-stone-400 font-medium mt-6 max-w-xs mx-auto leading-relaxed tracking-wider">
                Our master artisans are preparing new exclusive opportunities. Please return to the vault soon.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
