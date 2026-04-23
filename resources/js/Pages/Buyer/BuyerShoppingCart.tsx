import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

import { useCart } from '../../Context/CartContext';

declare function route(name: string, params?: any): string;

interface BuyerShoppingCartProps {
    cart_items: any[];
}

export default function BuyerShoppingCart({ cart_items }: BuyerShoppingCartProps) {
    const { cartItems, setItems, removeFromCart, updateQty } = useCart();

    // Sync backend items to global context on initial load if context is empty
    // and backend has items (useful for deep-linking or refreshes)
    React.useEffect(() => {
        if (cartItems.length === 0 && cart_items && cart_items.length > 0) {
            setItems(cart_items);
        }
    }, [cart_items]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = 20;
    const total = subtotal + delivery;

    return (
        <BuyerLayout>
            <Head title="Your Selection - Kokommerce" />

            <div className="max-w-7xl mx-auto px-4 pb-32">
                <header className="mb-10 md:mb-16">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-6">
                        <span className="text-[#d4af37]">01. Selection</span>
                        <span className="w-4 md:w-8 h-[1px] bg-gray-200"></span>
                        <span>02. Delivery</span>
                        <span className="w-4 md:w-8 h-[1px] bg-gray-200"></span>
                        <span>03. Payment</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic">
                        The Selection <span className="text-[#d4af37]">Basket.</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">Review your curated items before we fire the ovens.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    {/* Items List */}
                    <div className="lg:col-span-8 flex flex-col gap-4 md:gap-0 md:space-y-1">
                        <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <span className="col-span-6">Product Details</span>
                            <span className="col-span-2 text-center">Quantity</span>
                            <span className="col-span-2 text-center">Price</span>
                            <span className="col-span-2 text-right">Remove</span>
                        </div>

                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 items-center px-6 md:px-8 py-8 md:py-12 bg-white hover:bg-gray-50/50 transition-colors group rounded-3xl md:rounded-none border md:border-none border-gray-100 shadow-sm md:shadow-none gap-6 md:gap-0">
                                    <div className="w-full md:col-span-6 flex gap-4 md:gap-8 items-center">
                                        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden shadow-lg group-hover:scale-[1.02] transition-transform duration-500">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] mb-1 md:mb-2 block">{item.tag}</span>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight mb-1 md:mb-2">{item.name}</h3>
                                            <p className="text-xs text-gray-400 font-medium italic line-clamp-2 md:line-clamp-none">{item.desc}</p>
                                        </div>
                                    </div>

                                    <div className="w-full md:col-span-6 flex items-center justify-between md:grid md:grid-cols-6 md:gap-0">
                                        <div className="md:col-span-2 flex justify-start md:justify-center">
                                            <div className="flex items-center gap-4 md:gap-6 bg-gray-50 rounded-2xl px-4 md:px-5 py-2 md:py-3 border border-gray-100">
                                                <button
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="text-gray-300 hover:text-black transition-colors font-light text-xl"
                                                >
                                                    −
                                                </button>
                                                <span className="font-black text-gray-900 min-w-[20px] text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="text-gray-300 hover:text-black transition-colors font-light text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 text-center md:text-center shrink-0">
                                            <p className="text-lg md:text-xl font-black text-gray-900 tracking-tighter">₱{(item.price * item.qty).toLocaleString()}</p>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">₱{item.price.toLocaleString()} ea</p>
                                        </div>

                                        <div className="md:col-span-2 text-right">
                                            <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center md:ml-auto">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-40 text-center bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner flex flex-col items-center justify-center px-8">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-10 text-gray-200">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4 uppercase">Selection Currently Vacant</h3>
                                <p className="text-gray-400 font-medium italic max-w-xs mb-10 leading-relaxed">Your artisanal selection basket is awaiting fresh additions from our curated gallery.</p>
                                <Link href={route('buyer.shop')} className="inline-flex items-center gap-4 bg-[#2d2a26] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
                                    Browse the Gallery
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Order Summary - Premium Receipt Style */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <div className="bg-[#1a1a1a] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] translate-x-16 -translate-y-16 rotate-45 opacity-20"></div>

                                <h2 className="text-2xl font-black mb-10 tracking-tight">Voucher Box</h2>
                                <div className="flex gap-4 mb-16">
                                    <input type="text" placeholder="BREADLOVE20" className="flex-grow bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-xs font-bold tracking-widest uppercase outline-none focus:border-[#d4af37] transition-all" />
                                    <button className="bg-white text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-all">Apply</button>
                                </div>

                                <div className="space-y-6 pb-12 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Basket Subtotal</span>
                                        <span className="text-lg md:text-xl font-black tracking-tight">₱{subtotal.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Delivery Fee</span>
                                        <span className="text-lg md:text-xl font-black tracking-tight">₱{delivery.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Packaging Fee</span>
                                        <span className="text-[#d4af37] text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.2em]">Complimentary</span>
                                    </div>
                                </div>

                                <div className="pt-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                                    <div>
                                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Final Commitment</p>
                                        <p className="text-gray-400 text-[10px] font-medium leading-none">Inclusive of local taxes</p>
                                    </div>
                                    <p className="text-4xl md:text-5xl font-black tracking-tighter text-[#d4af37]">₱{total.toLocaleString()}</p>
                                </div>

                                <Link
                                    href={route('buyer.delivery')}
                                    className="w-full py-7 bg-[#d4af37] text-[#1a1a1a] rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:-translate-y-1 transition-all shadow-xl shadow-[#d4af37]/20 group"
                                >
                                    Proceed to Delivery
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>

                                <div className="mt-10 flex flex-col items-center gap-4">
                                    <div className="flex gap-4 opacity-30 invert hover:opacity-100 transition-opacity">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                                    </div>
                                    <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Secure Encryption Shield Active</p>
                                </div>
                            </div>

                            <div className="mt-8 p-10 bg-[#fdfcf0] rounded-[2.5rem] border border-[#f0ead2]">
                                <div className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-1 shrink-0"></div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase leading-loose tracking-widest">
                                        Each loaf is hand-scored and fired fresh upon your confirmation. Quality assurance is our formal commitment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
