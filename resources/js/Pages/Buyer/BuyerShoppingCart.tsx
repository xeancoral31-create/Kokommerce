import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

import { useCart } from '../../Context/CartContext';

declare function route(name: string, params?: any): string;

interface BuyerShoppingCartProps {
    cart_items: any[];
    active_promotions: any[];
}

export default function BuyerShoppingCart({ cart_items, active_promotions }: BuyerShoppingCartProps) {
    const { 
        cartItems, 
        setItems, 
        removeFromCart, 
        updateQty, 
        updateVariant,
        appliedVoucher, 
        applyVoucher, 
        removeVoucher
    } = useCart();
    const [voucherCode, setVoucherCode] = React.useState(appliedVoucher?.code || '');
    const [voucherError, setVoucherError] = React.useState('');
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [isRemoving, setIsRemoving] = React.useState<number | string | null>(null);
    const [isApplying, setIsApplying] = React.useState(false);

    // Sync backend items to global context on initial load if context is empty
    // and backend has items (useful for deep-linking or refreshes)
    React.useEffect(() => {
        if (!isInitialized && cart_items && cart_items.length > 0) {
            setItems(cart_items);
            setIsInitialized(true);
        } else if (!isInitialized) {
            setIsInitialized(true);
        }
    }, [cart_items, isInitialized]);

    const handleApplyVoucher = () => {
        setIsApplying(true);
        setVoucherError('');
        
        // Simulate artisanal validation delay
        setTimeout(() => {
            const promo = active_promotions.find(p => p.code.toUpperCase() === voucherCode.toUpperCase());
            
            if (promo) {
                // Determine if the promotion validity period has mathematically concluded
                const isExpired = promo.end_date && new Date(promo.end_date) < new Date();
                const isUsed = promo.is_used;

                if (isExpired) {
                    setVoucherError('This code has expired.');
                    setVoucherCode(''); 
                } else if (isUsed) {
                    setVoucherError('This reward has already been claimed by your account.');
                    setVoucherCode(''); 
                } else {
                    // Check if the product is in the cart if the promo is product-specific
                    // Per artisanal protocol, vouchers are strictly for Package variants
                    const isPackageInCart = cartItems.some(item => item.id === promo.product_id && item.priceType === 'Package');
                    
                    if (promo.product_id && !isPackageInCart) {
                        setVoucherError(`This code is only for the Package variant of ${promo.product?.name || 'selections'}.`);
                    } else {
                        applyVoucher(promo);
                        setVoucherError('');
                    }
                }
            } else {
                setVoucherError('Invalid voucher code.');
                setVoucherCode(''); // Reject invalid codes as well
            }
            setIsApplying(false);
        }, 800);
    };

    // Calculate totals and discounts
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = 20;

    // Determine the base subtotal for items that are eligible for discounts (Package selections)
    const packageItemsSubtotal = cartItems
        .filter(item => item.priceType === 'Package')
        .reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Calculate item-specific discounts
    const discountAmount = cartItems.reduce((acc, item) => {
        if (appliedVoucher) {
            // Product-specific bounty, restricted to Package variants per artisanal policy
            if (appliedVoucher.product_id && item.id === appliedVoucher.product_id && item.priceType === 'Package') {
                if (appliedVoucher.type === 'percentage') {
                    return acc + (item.price * item.qty * (appliedVoucher.discount_value / 100));
                } else {
                    return acc + (appliedVoucher.discount_value);
                }
            }
        }
        return acc;
    }, 0) + (appliedVoucher && !appliedVoucher.product_id ? 
        (appliedVoucher.type === 'percentage' ? (packageItemsSubtotal * (appliedVoucher.discount_value / 100)) : (packageItemsSubtotal > 0 ? appliedVoucher.discount_value : 0)) 
        : 0);

    const total = subtotal + delivery - discountAmount;

    return (
        <BuyerLayout>
            <Head title="Your Cart - Kokommerce" />

            <div className="max-w-7xl mx-auto px-6 pb-32 mt-16 md:mt-24">
                <header className="mb-10 md:mb-16">
                    <div className="mb-10">
                        <Link 
                            href="/buyer/shop" 
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all duration-300 active:scale-95 group shadow-sm"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Shop
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-6">
                        <span className="text-[#d4af37]">01. Cart</span>
                        <span className="w-4 md:w-8 h-[1px] bg-gray-200"></span>
                        <span>02. Delivery</span>
                        <span className="w-4 md:w-8 h-[1px] bg-gray-200"></span>
                        <span>03. Payment</span>
                    </div>
                        Your <span className="text-[#d4af37]">Cart.</span>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">Review your cart before checking out.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <span className="col-span-6">Product Details</span>
                            <span className="col-span-2 text-center">Quantity</span>
                            <span className="col-span-2 text-center">Price</span>
                            <span className="col-span-2 text-right">Remove</span>
                        </div>

                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 items-center px-6 py-6 md:py-8 bg-white hover:bg-gray-50/50 transition-colors group rounded-2xl border border-gray-100 shadow-sm gap-6 md:gap-0">
                                    <div className="w-full md:col-span-6 flex gap-4 md:gap-6 items-center">
                                        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:scale-[1.02] transition-transform duration-500">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-1 block">{item.tag}</span>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-tight mb-1">{item.name}</h3>
                                            <p className="text-xs text-gray-400 font-medium italic line-clamp-2 md:line-clamp-none mb-3">{item.desc}</p>
                                            <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 max-w-[180px]">
                                                <button 
                                                    onClick={() => updateVariant(item.id, 'Solo')}
                                                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${item.priceType === 'Solo' ? 'bg-white text-[#d4af37] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Solo
                                                </button>
                                                <button 
                                                    onClick={() => updateVariant(item.id, 'Package')}
                                                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${item.priceType === 'Package' ? 'bg-white text-[#d4af37] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    Package
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:col-span-6 flex items-center justify-between md:grid md:grid-cols-6 md:gap-0">
                                        <div className="md:col-span-2 flex justify-start md:justify-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-4 md:gap-6 bg-[#fcfaf7] rounded-2xl px-5 md:px-6 py-2.5 md:py-3.5 border border-[#d4af37]/20 shadow-sm transition-all hover:border-[#d4af37]/40 hover:bg-white group/qty">
                                                    <button
                                                        onClick={() => updateQty(item.id, -1)}
                                                        className="transition-colors font-black text-xl text-gray-300 hover:text-[#d4af37] active:scale-90"
                                                        title={item.isFixedQty ? "Remove one batch of 4" : "Decrease quantity"}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="flex flex-col items-center min-w-[40px]">
                                                        <div className="flex items-baseline gap-1">
                                                            {item.isFixedQty && (
                                                                <span className="text-[12px] font-black text-[#d4af37] animate-pulse">4x</span>
                                                            )}
                                                            <span className="font-black text-gray-900 text-2xl leading-none tracking-tighter">
                                                                {item.isFixedQty ? item.qty / 4 : item.qty}
                                                            </span>
                                                        </div>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 leading-none">{item.isFixedQty ? 'BATCHES' : 'UNITS'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => updateQty(item.id, 1)}
                                                        className="transition-colors font-black text-xl text-gray-300 hover:text-[#d4af37] active:scale-90"
                                                        title={item.isFixedQty ? "Add one batch of 4" : "Increase quantity"}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 text-center shrink-0">
                                            <div className="flex flex-col items-center md:items-center">
                                                <p className={`text-lg md:text-xl font-black tracking-tighter ${appliedVoucher && item.id === appliedVoucher.product_id ? 'text-green-600' : 'text-[#2d2a26]'}`}>
                                                    ₱{(item.price * item.qty - (appliedVoucher && item.id === appliedVoucher.product_id ? (appliedVoucher.type === 'percentage' ? (item.price * item.qty * (appliedVoucher.discount_value / 100)) : appliedVoucher.discount_value) : 0)).toLocaleString()}
                                                </p>
                                                {appliedVoucher && item.id === appliedVoucher.product_id && (
                                                    <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest line-through mb-1">₱{(item.price * item.qty).toLocaleString()}</p>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[8px] font-black text-white bg-[#d4af37] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                        {item.isFixedQty ? '4x BATCH' : 'UNIT'}
                                                    </span>
                                                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">₱{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`md:col-span-2 flex justify-end transition-all duration-500 ${isRemoving === item.id ? 'scale-75 opacity-0 blur-sm' : ''}`}>
                                            <button 
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setIsRemoving(item.id);
                                                    setTimeout(() => {
                                                        removeFromCart(item.id);
                                                        setIsRemoving(null);
                                                    }, 500);
                                                }} 
                                                className="w-14 h-14 rounded-2xl bg-white text-gray-300 hover:bg-black hover:text-white hover:rotate-6 transition-all duration-500 flex items-center justify-center group/trash border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] active:scale-95"
                                                title="Remove selection from cart"
                                            >
                                                <svg className="w-6 h-6 transition-transform group-hover/trash:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center bg-gray-50 rounded-2xl border border-gray-100 shadow-inner flex flex-col items-center justify-center px-8">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-[#d4af37]">
                                    <i className="fa-solid fa-cart-arrow-down text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2 uppercase">Your Cart is Empty</h3>
                                <p className="text-gray-400 font-medium italic max-w-xs mb-8 text-sm">Add some items from our shop to get started.</p>
                                <Link href={route('buyer.shop')} className="inline-flex items-center gap-3 bg-[#2d2a26] text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-md hover:bg-black transition-all">
                                    Go to Shop
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            </div>
                          )}
                    </div>

                    {/* Order Summary - Premium Receipt Style */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden text-sm">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37] translate-x-12 -translate-y-12 rotate-45 opacity-20"></div>

                                <h2 className="text-xl font-bold mb-8 tracking-tight italic">Vouchers</h2>
                                <div className="space-y-4 mb-16">
                                    <div className="flex gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="BREADLOVE20" 
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value)}
                                            disabled={!!appliedVoucher}
                                            className={`flex-grow bg-white/10 border ${voucherError ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-6 py-4 text-xs font-bold tracking-widest uppercase outline-none focus:border-[#d4af37] transition-all disabled:opacity-50`} 
                                        />
                                        {appliedVoucher ? (
                                            <button 
                                                onClick={removeVoucher}
                                                className="bg-red-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleApplyVoucher}
                                                disabled={!voucherCode || isApplying}
                                                className="bg-white text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-all disabled:opacity-30"
                                            >
                                                {isApplying ? '...' : 'Apply'}
                                            </button>
                                        )}
                                    </div>
                                    {voucherError && <p className="text-[9px] font-black text-red-400 uppercase tracking-widest text-center animate-pulse">{voucherError}</p>}
                                    {appliedVoucher && (
                                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-xl animate-in zoom-in-95 duration-300">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                            <span className="text-[9px] font-black text-green-400 uppercase tracking-[0.2em]">{appliedVoucher.title} Applied</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6 pb-12 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                        <span className="text-lg md:text-xl font-black tracking-tight">₱{subtotal.toLocaleString()}.00</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-500/60 text-[10px] md:text-xs font-black uppercase tracking-widest">Discount</span>
                                            <span className="text-lg md:text-xl font-black tracking-tight text-green-400">- ₱{discountAmount.toLocaleString()}.00</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Delivery Fee</span>
                                        <span className="text-lg md:text-xl font-black tracking-tight">₱{delivery.toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">Packaging Fee</span>
                                        <span className="text-[#d4af37] text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.2em]">Complimentary</span>
                                    </div>
                                </div>

                                <div className="pt-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-0">
                                    <div>
                                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1 leading-none">Total</p>
                                        <p className="text-gray-500 text-[10px] font-medium leading-none">Inclusive of local taxes</p>
                                    </div>
                                    <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#d4af37]">₱{total.toLocaleString()}</p>
                                </div>

                                <Link
                                    href="/buyer/delivery"
                                    className="w-full py-5 bg-[#d4af37] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)] hover:bg-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 group border border-[#d4af37]/20"
                                >
                                    <span>Proceed to Delivery</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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

                            <div className="mt-6 p-6 bg-[#fdfcf0] rounded-2xl border border-[#f0ead2]">
                                <div className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1 shrink-0"></div>
                                    <p className="text-[10px] font-medium text-gray-600 leading-relaxed">
                                        Each item is baked fresh for your order.
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
