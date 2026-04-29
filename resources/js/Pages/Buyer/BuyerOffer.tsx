import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { useCart, Promotion as BasePromotion, CartItem } from '../../Context/CartContext';
import { Inertia } from '@inertiajs/inertia';
import CountdownTimer from '../../Components/CountdownTimer';
import { Product } from '../../types';

interface Bounty {
    id: number;
    title: string;
    description: string;
    code: string;
    type: 'percentage' | 'fixed';
    discount_value: number;
    image: string | null;
    end_date: string | null;
    is_used?: boolean;
    product?: Product;
}

const Star = () => (
    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

export default function BuyerOffer({ promotions }: { promotions: Bounty[] }) {
    const { addToCart, applyVoucher } = useCart();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [showUsedModal, setShowUsedModal] = React.useState(false);
    const [expiredStatus, setExpiredStatus] = React.useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        promotions.forEach(p => {
            if (p.end_date && new Date(p.end_date) < new Date()) {
                initial[p.id] = true;
            }
        });
        return initial;
    });

    const handleExpire = (id: number) => {
        setExpiredStatus(prev => ({ ...prev, [id]: true }));
    };

    const calculateFinalPrice = (offer: Bounty) => {
        if (!offer.product) return 0;
        const price = parseFloat(offer.product.price as string);
        if (offer.type === 'percentage') {
            return price * (1 - (offer.discount_value || 0) / 100);
        }
        return Math.max(0, price - (offer.discount_value || 0));
    };

    const nextOffer = () => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
    };

    const prevOffer = () => {
        setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
    };

    const currentOffer = promotions[currentIndex];
    const isCurrentExpired = expiredStatus[currentOffer?.id];

    const handleClaim = () => {
        if (isCurrentExpired) return;

        if (currentOffer.is_used) {
            setShowUsedModal(true);
            return;
        }

        if (currentOffer.product) {
            const product = currentOffer.product;
            const solo_price = Number(product.solo_price || product.price);
            const package_price = Number(product.package_price || product.price);
            const isSoloFixed4 = solo_price >= 5 && solo_price <= 20;

            addToCart({
                id: `${product.id}_solo`,
                original_id: product.id,
                name: product.name,
                price: Number(product.price),
                solo_price: solo_price,
                package_price: package_price,
                qty: isSoloFixed4 ? 4 : 1,
                isFixedQty: isSoloFixed4,
                img: product.image || product.solo_image || product.img || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
                desc: currentOffer.description,
                tag: 'Exclusive Bounty',
                priceType: 'Solo'
            });
            applyVoucher({
                id: currentOffer.id,
                product_id: currentOffer.product.id,
                code: currentOffer.code,
                type: currentOffer.type,
                discount_value: currentOffer.discount_value,
                title: currentOffer.title,
                end_date: currentOffer.end_date,
                is_used: currentOffer.is_used
            });
            Inertia.visit('/buyer/cart');
        }
    };

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
                                            className={`w-full h-full object-cover transition-all duration-1000 ${isCurrentExpired ? 'grayscale scale-100' : 'grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105'}`}
                                        />
                                        <div className="absolute top-8 left-8">
                                            {isCurrentExpired ? (
                                                <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                                                    ARCHIVED COLLECTION
                                                </span>
                                            ) : (
                                                <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[#eca840] rounded-full animate-ping"></div>
                                                    AUTHENTIC CRAFT
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute bottom-8 right-8 h-12 px-6 bg-black/40 backdrop-blur-md rounded-2xl flex items-center gap-3 border border-white/10">
                                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Invitation</span>
                                            <span className="text-sm font-black text-white">{(currentIndex + 1).toString().padStart(2, '0')} <span className="text-[#eca840] invisible md:visible">/</span> {promotions.length.toString().padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                                    <div className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-widest mb-6 ${isCurrentExpired ? 'text-red-500' : 'text-[#eca840]'}`}>
                                        <div className={`w-12 h-px ${isCurrentExpired ? 'bg-red-500' : 'bg-[#eca840]'}`}></div>
                                        {isCurrentExpired ? 'COLLECTION EXPIRED' : (currentOffer.type === 'percentage' ? `${currentOffer.discount_value}% DISCOUNT` : `₱${currentOffer.discount_value} OFF`)}
                                    </div>
                                    <h2 className={`text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight ${isCurrentExpired ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                                        {currentOffer.title}
                                    </h2>
                                    <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                                        {currentOffer.description}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-10 w-full mb-16 items-start">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col items-start relative overflow-hidden group w-full sm:w-1/2">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                            <span className="text-[9px] font-black text-[#eca840]/60 uppercase tracking-[0.4em] mb-4">ACCESS CODE</span>
                                            <span className={`text-2xl font-[1000] tracking-[0.3em] font-mono transition-colors ${isCurrentExpired ? 'text-gray-300' : 'text-gray-900 group-hover:text-[#eca840]'}`}>{currentOffer.code}</span>
                                        </div>
                                        {currentOffer.product && (
                                            <div className={`p-8 rounded-[2.5rem] border shadow-2xl flex flex-col relative overflow-hidden transition-colors duration-700 w-full sm:w-1/2 ${isCurrentExpired ? 'bg-stone-100 border-stone-200' : 'bg-[#1c1917] border-white/5'}`}>
                                                <div className="absolute top-0 right-0 p-4 opacity-10 text-[#eca840]"><Star /></div>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] mb-4 ${isCurrentExpired ? 'text-stone-400' : 'text-[#eca840]/40'}`}>VALUATION</span>
                                                <div className="flex items-baseline gap-4 mb-6">
                                                    <span className={`text-3xl font-[1000] tracking-tighter ${isCurrentExpired ? 'text-stone-400' : 'text-white'}`}>₱{(calculateFinalPrice(currentOffer)).toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-gray-500 line-through">₱{Number(currentOffer.product.price).toLocaleString()}</span>
                                                </div>
                                                <div className={`mt-auto pt-6 border-t ${isCurrentExpired ? 'border-stone-200' : 'border-white/5'}`}>
                                                    <CountdownTimer
                                                        endDate={currentOffer.end_date}
                                                        onExpire={() => handleExpire(currentOffer.id)}
                                                        labelClassName="text-[8px] font-black text-[#eca840]/20 uppercase tracking-[0.4em] mb-3"
                                                        timeClassName={`text-lg font-[1000] tabular-nums tracking-widest ${isCurrentExpired ? 'text-red-500' : 'text-white'}`}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full mt-4">
                                        <button
                                            disabled={isCurrentExpired}
                                            onClick={handleClaim}
                                            className={`w-full sm:flex-1 group relative font-[1000] px-16 py-7 rounded-[2.5rem] text-[10px] uppercase tracking-[0.5em] transition-all duration-700 ${isCurrentExpired ? 'bg-stone-50 text-stone-300 cursor-not-allowed border border-stone-100 shadow-none' : (currentOffer.is_used ? 'bg-stone-200 text-stone-500 cursor-not-allowed' : 'bg-[#1c1917] hover:bg-[#eca840] text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] hover:shadow-[#eca840]/40 active:scale-95')}`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-4">
                                                {isCurrentExpired ? 'PERIOD EXPIRED' : (currentOffer.is_used ? 'REWARD CLAIMED' : 'CLAIM REWARD')}
                                                {!isCurrentExpired && !currentOffer.is_used && <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                                                {currentOffer.is_used && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
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

            {/* Already Used Modal */}
            {showUsedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowUsedModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                        <div className="absolute top-0 right-0 p-8">
                            <button 
                                onClick={() => setShowUsedModal(false)}
                                className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:rotate-90 transition-all duration-500"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-12 md:p-16">
                            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-10 shadow-sm border border-stone-100">
                                <svg className="w-10 h-10 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            
                            <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.4em] mb-4 block">SECURITY PROTOCOL</span>
                            <h3 className="text-3xl md:text-4xl font-black text-stone-900 mb-6 tracking-tight">Reward Already <span className="text-[#eca840]">Claimed.</span></h3>
                            <p className="text-stone-500 text-lg leading-relaxed font-medium mb-10">
                                Our records indicate this artisanal invitation has already been redeemed by your account. Each bounty is strictly limited to a single unique acquisition.
                            </p>
                            
                            <button 
                                onClick={() => setShowUsedModal(false)}
                                className="w-full py-5 bg-[#1c1917] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95"
                            >
                                Acknowledge & Close
                            </button>
                        </div>
                        
                        <div className="h-2 bg-[#eca840]"></div>
                    </div>
                </div>
            )}
        </BuyerLayout>
    );
}

