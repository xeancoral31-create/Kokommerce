import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { useCart } from '../../Context/CartContext';

interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  discount_value: number;
  image: string | null;
  product?: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

const Star = () => (
    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

export default function BuyerOffer({ promotions }: { promotions: Promotion[] }) {
    const { addToCart } = useCart();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const calculateFinalPrice = (offer: Promotion) => {
        if (!offer.product) return 0;
        if (offer.type === 'percentage') {
            return offer.product.price * (1 - offer.discount_value / 100);
        }
        return Math.max(0, offer.product.price - offer.discount_value);
    };

    const nextOffer = () => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
    };

    const prevOffer = () => {
        setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
    };

    const currentOffer = promotions[currentIndex];

    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                <header className="mb-16 md:mb-24 text-center">
                    <span className="inline-block bg-[#fffcf5] text-[#eca840] px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-sm border border-[#fff8e6]">
                        CURATED BOUNTIES
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
                        Seasonal <span className="text-[#eca840]">Treasures.</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto text-base md:text-lg leading-relaxed">
                        Exclusively gathered for our discerning patrons. Experience the peak of artisanal craft through these limited invitations.
                    </p>
                </header>

                {promotions.length > 0 ? (
                    <div className="relative group/carousel">
                        {/* Navigation Overlay */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:-mx-16 z-20 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-500">
                            <button 
                                onClick={prevOffer}
                                className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-gray-900 shadow-xl hover:bg-[#eca840] hover:text-white transition-all pointer-events-auto active:scale-90"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button 
                                onClick={nextOffer}
                                className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-gray-900 shadow-xl hover:bg-[#eca840] hover:text-white transition-all pointer-events-auto active:scale-90"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div key={currentOffer.id} className="animate-in fade-in zoom-in-95 duration-700">
                            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                                <div className="w-full md:w-1/2 relative group">
                                    <div className="absolute -inset-4 bg-[#eca840]/5 rounded-[3rem] blur-2xl group-hover:bg-[#eca840]/10 transition-all duration-700"></div>
                                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[4/5] md:aspect-square">
                                        <img 
                                            src={currentOffer.image || currentOffer.product?.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"} 
                                            alt={currentOffer.title} 
                                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                                        />
                                        <div className="absolute top-8 left-8">
                                            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#eca840] rounded-full animate-ping"></div>
                                                AUTHENTIC CRAFT
                                            </span>
                                        </div>
                                        <div className="absolute bottom-8 right-8 h-12 px-6 bg-black/40 backdrop-blur-md rounded-2xl flex items-center gap-3 border border-white/10">
                                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Invitation</span>
                                            <span className="text-sm font-black text-white">{(currentIndex + 1).toString().padStart(2, '0')} <span className="text-[#eca840] invisible md:visible">/</span> {promotions.length.toString().padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                                    <div className="flex items-center gap-4 text-[#eca840] text-[11px] font-black uppercase tracking-widest mb-6">
                                        <div className="w-12 h-px bg-[#eca840]"></div>
                                        {currentOffer.type === 'percentage' ? `${currentOffer.discount_value}% DISCOUNT` : `₱${currentOffer.discount_value} OFF`}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                                        {currentOffer.title}
                                    </h2>
                                    <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                                        {currentOffer.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-12">
                                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">ACCESS CODE</span>
                                            <span className="text-xl font-black text-gray-900 tracking-[0.2em] font-mono">{currentOffer.code}</span>
                                        </div>
                                        {currentOffer.product && (
                                            <div className="bg-[#fffdfa] p-6 rounded-3xl border border-[#fff4e0] shadow-sm flex flex-col relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10"><Star /></div>
                                                <span className="text-[10px] font-black text-[#eca840]/60 uppercase tracking-widest mb-2">OFFER VALUE</span>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-2xl font-black text-gray-900 animate-pulse">₱{(calculateFinalPrice(currentOffer)).toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-gray-300 line-through">₱{currentOffer.product.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                                        <button 
                                            onClick={() => currentOffer.product && addToCart({
                                                id: currentOffer.product.id,
                                                name: currentOffer.product.name,
                                                price: calculateFinalPrice(currentOffer),
                                                qty: 1,
                                                img: currentOffer.product.image,
                                                desc: currentOffer.description
                                            })}
                                            className="w-full sm:flex-1 group relative bg-[#2d2a26] hover:bg-[#eca840] text-white font-black px-12 py-5 rounded-[2rem] text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-95"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                Claim This Bounty
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </span>
                                        </button>
                                        
                                        {/* Mobile Mini Nav */}
                                        <div className="flex md:hidden items-center gap-4">
                                            <button onClick={prevOffer} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <button onClick={nextOffer} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 text-gray-300">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <p className="text-gray-400 font-black text-xl italic tracking-tight">The vault is currently sealed. Fresh treasures are being curated.</p>
                        <button className="mt-8 text-[#eca840] font-black text-xs uppercase tracking-widest border-b-2 border-[#eca840]/20 pb-1 hover:border-[#eca840] transition-all">Return to Gallery</button>
                    </div>
                )}
            </div>
        </BuyerLayout>
    );
}

