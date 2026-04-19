import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

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

export default function BuyerOffer({ promotions }: { promotions: Promotion[] }) {
    return (
        <BuyerLayout>
            <header className="mb-12 text-center text-gray-900">
                <span className="inline-block bg-[#fff8e6] text-[#f2994a] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">EXCLUSIVE PRIVILEGES</span>
                <h1 className="text-5xl font-black mb-4 tracking-tighter">Curated <span className="text-[#f5a623]">Bounties.</span></h1>
                <p className="text-gray-400 font-medium max-w-lg mx-auto">Savor the essence of our artisanal heritage through these limited-time collections.</p>
            </header>

            <div className="space-y-12">
                {promotions.map((offer, index) => (
                    <div key={offer.id} className={`bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="md:w-1/2 h-[450px]">
                            <img src={offer.image || offer.product?.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"} alt={offer.title} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />
                        </div>
                        <div className="md:w-1/2 p-16 flex flex-col justify-center">
                            <span className="text-[#f5a623] font-black tracking-[0.2em] text-[10px] uppercase mb-4 flex items-center gap-3">
                                <div className="w-8 h-px bg-[#f5a623]"></div>
                                {offer.type === 'percentage' ? `${offer.discount_value}% OFF` : `₱${offer.discount_value} OFF`}
                            </span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{offer.title}</h2>
                            <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">{offer.description}</p>
                            
                            <div className="flex items-center gap-6 mb-12">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">PROMO CODE</span>
                                    <span className="text-xl font-black text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-dashed border-gray-200">{offer.code}</span>
                                </div>
                                {offer.product && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">UNIT PRICE</span>
                                        <span className="text-xl font-black text-gray-400 line-through">₱{offer.product.price}</span>
                                    </div>
                                )}
                            </div>

                            <button className="bg-[#f5a623] hover:bg-black text-white font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] w-max shadow-xl shadow-[#f5a623]/20 transition-all active:scale-95">
                                Claim This Bounty
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {promotions.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold text-lg italic">The vault is currently empty. Check back for fresh seasonal treasures.</p>
                </div>
            )}
        </BuyerLayout>
    );
}

