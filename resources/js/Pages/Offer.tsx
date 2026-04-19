import React from "react";

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const Truck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
);

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  discount_value: number;
  image: string | null;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

export default function Offer({ promotions }: { promotions: Promotion[] }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] pt-20">
      <Navbar />
      <main className="flex-grow">

      <div className="container mx-auto px-6 md:px-12 py-12">
        
        {/* Seasonal Special Hero - Latest Promotion */}
        {promotions.length > 0 && (
          <section className="mb-16">
            <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm">
              <div className="bg-[#2a2626] text-white p-10 md:p-16 w-full md:w-3/5 flex flex-col justify-center items-start">
                <span className="bg-[#eca840] text-white text-[10px] font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                  Featured Promotion
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {promotions[0].title}
                </h1>
                <p className="text-gray-300 mb-8 max-w-sm leading-relaxed">
                  {promotions[0].description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-3 bg-[#eca840]/20 border border-[#eca840] rounded-xl text-[#eca840] font-black tracking-widest uppercase">
                    Code: {promotions[0].code}
                  </div>
                  <button className="bg-[#eca840] hover:bg-[#d69635] text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    Claim Offer
                  </button>
                </div>
              </div>
              <div className="bg-[#fcf8f0] w-full md:w-2/5 p-10 flex items-center justify-center relative min-h-[300px]">
                <div className="relative w-full h-full min-h-[250px]">
                  <img 
                    src={promotions[0].image || (promotions[0].product?.image) || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop"} 
                    alt={promotions[0].title} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Artisanal Collections & Promotions */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Current Promotions</h2>
            <div className="text-sm font-bold text-[#eca840]">Limited Time Offers</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.slice(1).map((promo) => (
              <div key={promo.id} className="bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={promo.image || (promo.product?.image) || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {promo.type === 'percentage' ? `${promo.discount_value}% OFF` : `₱${promo.discount_value} OFF`}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
                    <span className="text-[10px] font-black text-[#eca840] border border-[#eca840]/20 px-2 py-1 rounded-md">{promo.code}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-8 leading-relaxed line-clamp-2">
                    {promo.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Target Product</p>
                      <p className="text-sm font-bold text-gray-800">{promo.product?.name || 'Store Wide'}</p>
                    </div>
                    <button className="px-6 py-2.5 bg-[#f5a623] hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery banner */}
        <div className="bg-[#fdf8ee] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-[#fae5c3]">
          <div className="flex items-center mb-4 md:mb-0">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#eca840] shadow-sm mr-4 flex-shrink-0">
                <Truck className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900">Free Delivery on Promotions</h4>
                <p className="text-xs text-gray-600">All orders containing a 'Seasonal Special' ship free this month.</p>
             </div>
          </div>
          <p className="text-xl font-bold text-[#eca840] italic">#KokommerceAtHome</p>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

