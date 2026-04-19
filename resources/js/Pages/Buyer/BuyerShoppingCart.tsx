import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

export default function BuyerShoppingCart() {
    const [items, setItems] = React.useState([
        { id: 1, name: "Signature Sourdough Batard", desc: "Slow-fermented for 24 hours", price: 280, qty: 1, tag: "Best Seller", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Ube Halaya Sapin-Sapin", desc: "Three-layer steamed rice cake", price: 350, qty: 2, tag: "Heirloom", img: "https://images.unsplash.com/photo-1589113331629-34657ce8c9d2?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Dark Choco Chunk Cookies", desc: "Box of 6 artisan cookies", price: 420, qty: 1, tag: "New Arrival", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400" },
    ]);

    const updateQty = (id: number, delta: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = 120;
    const total = subtotal + delivery;

    return (
        <BuyerLayout>
            <div className="max-w-6xl mx-auto pb-20">
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-[#2d2a26]">Your Basket</h1>
                    <p className="text-gray-500 mt-2">Review your artisanal selection before we prepare the hearth.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map(item => (
                            <div key={item.id} className="buyer-card bg-white p-6 md:p-8 flex gap-8 items-center border-none shadow-sm h-full">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="bg-[#f0f9ff] text-[#2f80ed] text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">{item.tag}</span>
                                            <h3 className="text-xl font-bold text-[#2d2a26] leading-tight">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                                        </div>
                                        <p className="text-xl font-bold text-[#eca840]">₱{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="qty-control">
                                            <button onClick={() => updateQty(item.id, -1)}>−</button>
                                            <span className="font-bold text-sm min-w-[20px] text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)}>+</button>
                                        </div>
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Upsell Section */}
                        <div className="mt-20">
                             <h2 className="text-2xl font-bold mb-8 text-[#2d2a26]">Complete your breakfast</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="buyer-card bg-white p-6">
                                     <img src="https://images.unsplash.com/photo-1589113331629-34657ce8c9d2?auto=format&fit=crop&q=80&w=400" className="w-full h-40 object-cover rounded-xl mb-6" alt="Butter" />
                                     <h4 className="font-bold">Cultured Herbed Butter</h4>
                                     <p className="text-gold font-bold mt-1">₱180.00</p>
                                     <button className="btn-buyer btn-buyer-outline w-full mt-4 text-xs font-bold py-3 uppercase">Add to Cart</button>
                                 </div>
                                 <div className="buyer-card bg-white p-6">
                                     <img src="https://images.unsplash.com/photo-1544333303-5775aa666d7e?auto=format&fit=crop&q=80&w=400" className="w-full h-40 object-cover rounded-xl mb-6" alt="Coffee" />
                                     <h4 className="font-bold">Signature House Blend</h4>
                                     <p className="text-gold font-bold mt-1">₱450.00</p>
                                     <button className="btn-buyer btn-buyer-outline w-full mt-4 text-xs font-bold py-3 uppercase">Add to Cart</button>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="order-summary-box shadow-2xl">
                            <h2 className="font-black">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="summary-row"><span>Subtotal</span> <span className="text-white">₱{subtotal.toLocaleString()}.00</span></div>
                                <div className="summary-row"><span>Estimated Delivery</span> <span className="text-white">₱{delivery.toLocaleString()}.00</span></div>
                                <div className="summary-row"><span>Eco-Packaging</span> <span className="text-[#eca840] font-black uppercase text-[10px]">Free</span></div>
                                <div className="summary-row total">
                                    <span>TOTAL AMOUNT</span>
                                    <span className="price">₱{total.toLocaleString()}.00</span>
                                </div>
                            </div>
                            <button className="w-full btn-buyer btn-buyer-gold py-5 mt-10 text-sm flex items-center justify-center gap-3">
                                PROCEED TO DELIVERY
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H18a1 1 0 001-1V8a1 1 0 00-1-1h-4.05z" /></svg>
                            </button>
                            <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">Secure Checkout by Kokommerce Pay</p>

                            <div className="mt-12 bg-white/5 p-6 rounded-2xl">
                                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Have a promo code?</p>
                                 <div className="flex gap-2">
                                     <input type="text" placeholder="BREADLOVER20" className="flex-grow bg-white/10 border-none px-4 py-3 rounded-lg text-white text-sm outline-none" />
                                     <button className="bg-white/20 px-4 py-3 rounded-lg text-white font-bold text-xs hover:bg-white/30 transition-colors">Apply</button>
                                 </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-[#fff8e6] rounded-2xl flex items-start gap-4">
                             <div className="w-6 h-6 bg-[#eca840] rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-[10px] italic">i</div>
                             <p className="text-[10px] text-[#2d2a26] leading-relaxed opacity-80">Artisanal goods are baked fresh daily. Orders placed after 4 PM will be prepared and delivered the following morning.</p>
                        </div>
                    </div>
                </div>
            </div>
        </BuyerLayout>
    );
}
