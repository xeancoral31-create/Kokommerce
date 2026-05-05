import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useNotifications } from '../../Context/NotificationContext';
import { Bell, ArrowRight, Package, CreditCard, Tag } from 'lucide-react';

interface BuyerHomeProps {
    user_name: string;
    featured_products: any[];
    new_arrivals: any[];
    recent_favorites: any[];
    promotions: any[];
    stats: {
        recent_orders_count: number;
        available_offers: number;
    };
}

declare function route(name: string, params?: any): string;

export default function BuyerHome({ user_name, featured_products, new_arrivals, recent_favorites, promotions, stats }: BuyerHomeProps) {
    const { isDetectingLocation } = useCart();
    const [isBuyModalOpen, setIsBuyModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
    const [quantity, setQuantity] = React.useState(1);
    const [notification, setNotification] = React.useState<string | null>(null);
    const { notifications, markAsRead } = useNotifications();

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const openBuyModal = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsBuyModalOpen(true);
    };

    const displayedProducts = recent_favorites;
    return (
        <BuyerLayout>
            <Head title="Kokommerce - Home" />
            
            {notification && (
                <div className="fixed top-12 right-12 z-[2000] animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="bg-[#141414] text-white px-10 py-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-6 border border-white/10 backdrop-blur-3xl">
                        <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 20.2 10.7 19C5.8 14.5 2.5 11.5 2.5 7.8A4.8 4.8 0 0 1 7.3 3a5.3 5.3 0 0 1 4.7 2.6A5.3 5.3 0 0 1 16.7 3a4.8 4.8 0 0 1 4.8 4.8c0 3.7-3.3 6.7-8.2 11.2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em] mb-1">Concierge Note</span>
                            <span className="text-base font-bold tracking-tight text-white/90">{notification}</span>
                            {notification.includes('added') && (
                                <Link 
                                    href="/buyer/wishlist" 
                                    className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-3 hover:text-[#d4af37] transition-all flex items-center gap-2 group/link"
                                >
                                    Review Curated Collection
                                    <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Professional & Formal Hero Section */}
            <section className="relative mb-16 overflow-hidden rounded-[2rem] bg-[#1a1a1a] min-h-[480px] flex flex-col justify-center group shadow-2xl">
                <div className="absolute inset-0 transition-transform duration-[2s] group-hover:scale-105 pointer-events-none">
                    <img 
                        src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=2000" 
                        alt="Bakery background" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#141414] via-[#141414]/90 md:via-[#141414]/80 to-[#141414]/50 md:to-transparent"></div>
                </div>
                
                <div className="relative z-10 w-full p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 lg:gap-8 min-h-[480px]">
                    <div className="max-w-3xl w-full animate-in fade-in slide-in-from-left-8 duration-1000 mt-auto lg:mt-0 lg:mb-auto">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-xl bg-white/5 mb-8">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                            <span className="text-white/90 text-[10px] font-black uppercase tracking-[0.3em]">Curated Membership — {user_name}</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                            Exquisite Artisanal <span className="text-[#d4af37] block mt-2 font-light italic">Bakery Goods.</span>
                        </h1>
                        
                        <p className="text-lg text-white/50 font-medium leading-relaxed mb-10 max-w-xl">
                            Discover the intersection of tradition and modern culinary art. Handcrafted selections delivered with precision to your doorstep.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 md:gap-5">
                            <Link 
                                href={route('buyer.shop')}
                                className="px-10 md:px-12 py-4 md:py-5 bg-[#d4af37] text-[#141414] rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:bg-white hover:text-black hover:-translate-y-1 transition-all duration-500 active:scale-95 border border-[#d4af37]"
                            >
                                Explore Collection
                            </Link>
                            <Link 
                                href={route('buyer.offer')}
                                className="px-10 md:px-12 py-4 md:py-5 bg-white/5 backdrop-blur-2xl text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:-translate-y-1 transition-all duration-500 active:scale-95"
                            >
                                Exclusive Access
                            </Link>
                        </div>
                    </div>

                    {/* Floating Meta Indices */}
                    <div className="w-full lg:w-auto flex flex-row flex-wrap sm:flex-nowrap gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mt-auto">
                        <div className="backdrop-blur-3xl bg-[#141414]/40 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col items-start md:items-center justify-center flex-1 lg:flex-none min-w-[150px] group/stat hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-2xl">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-3 group-hover/stat:text-[#d4af37] transition-colors">Active Offers</p>
                            <p className="text-white text-4xl md:text-5xl font-light tracking-tighter">{stats.available_offers.toString().padStart(2, '0')}</p>
                        </div>
                        <Link href="/buyer/history" className="backdrop-blur-3xl bg-[#141414]/40 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col items-start md:items-center justify-center flex-1 lg:flex-none min-w-[150px] group/stat hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-500 shadow-2xl">
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-3 group-hover/stat:text-[#d4af37] transition-colors">Completed Orders</p>
                            <p className="text-white text-4xl md:text-5xl font-light tracking-tighter">{stats.recent_orders_count.toString().padStart(2, '0')}</p>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Buy Now Modal (Dark Professional UI) */}
            {isBuyModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsBuyModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#141414] rounded-2xl shadow-xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md border border-white/10 shrink-0 bg-white/5">
                                    <img src={selectedProduct.image || selectedProduct.solo_image || selectedProduct.img} className="w-full h-full object-cover" alt={selectedProduct.name} />
                                </div>
                                <div className="max-w-[200px]">
                                    <h3 className="text-xl font-bold text-white tracking-tight mb-1">{selectedProduct.name}</h3>
                                    <p className="text-white/40 text-[10px] font-medium leading-relaxed truncate">{selectedProduct.category?.name} — ₱{parseFloat(selectedProduct.price).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setIsBuyModalOpen(false)} className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex flex-col">
                                        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">Quantity Control</p>
                                        <p className="text-white/40 text-[9px] font-medium italic">
                                            {selectedProduct.solo_price >= 5 && selectedProduct.solo_price <= 15 
                                                ? "Fixed Artisanal Batch (4x Units)" 
                                                : "Standard Unit Selection"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-2 border border-white/5">
                                        <button 
                                            onClick={() => {
                                                const step = (selectedProduct.solo_price >= 5 && selectedProduct.solo_price <= 15) ? 4 : 1;
                                                setQuantity(q => Math.max(step, q - step));
                                            }}
                                            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#d4af37] transition-all text-xl font-light hover:bg-white/5 rounded-xl"
                                        >
                                            —
                                        </button>
                                        <div className="flex flex-col items-center min-w-[40px]">
                                            <span className="text-[#d4af37] text-lg font-black">{quantity}</span>
                                            <span className="text-white/20 text-[7px] font-black uppercase tracking-widest -mt-1">
                                                {(selectedProduct.solo_price >= 5 && selectedProduct.solo_price <= 15) ? "Units" : "Qty"}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const step = (selectedProduct.solo_price >= 5 && selectedProduct.solo_price <= 15) ? 4 : 1;
                                                setQuantity(q => q + step);
                                            }}
                                            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[#d4af37] transition-all text-xl font-light hover:bg-white/5 rounded-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-2xl flex items-center justify-between">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Inventory Status</span>
                                    <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest">
                                        {selectedProduct.stock || Math.floor(Math.random() * 20) + 10} Units Reserved
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    const soloPrice = parseFloat(selectedProduct.solo_price || selectedProduct.price || 0);
                                    const isFixed = soloPrice >= 5 && soloPrice <= 15;
                                    
                                    const cartItem = {
                                        id: selectedProduct.id + '_solo',
                                        original_id: selectedProduct.id,
                                        name: selectedProduct.name,
                                        price: soloPrice,
                                        solo_price: soloPrice,
                                        package_price: soloPrice * 0.9,
                                        qty: quantity,
                                        img: selectedProduct.image || selectedProduct.solo_image || selectedProduct.img,
                                        priceType: 'Solo',
                                        category: selectedProduct.category?.name || 'ARTISANAL',
                                        isFixedQty: isFixed
                                    };
                                    
                                    // Use local storage and navigate directly to cart for Buy Now
                                    const existingCart = JSON.parse(localStorage.getItem('artisanal_cart') || '[]');
                                    const filtered = existingCart.filter((i: any) => i.id !== cartItem.id);
                                    localStorage.setItem('artisanal_cart', JSON.stringify([...filtered, cartItem]));
                                    window.location.href = route('buyer.cart');
                                }}
                                className="w-full py-5 bg-[#d4af37] text-[#1c1917] rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(212,175,55,0.1)] active:scale-95"
                            >
                                Secure Acquisition — ₱{(parseFloat(selectedProduct.price) * (quantity)).toLocaleString()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Promotions */}
            {promotions.length > 0 && (
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {promotions.map((promo) => (
                            <Link key={promo.id} href={route('buyer.offer')} className="group relative overflow-hidden rounded-2xl aspect-[16/10] bg-[#1a1a1a]">
                                <img src={promo.image || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={promo.title} />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <span className="text-[#d4af37] text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Limited Event</span>
                                    <h3 className="text-xl font-bold text-white tracking-tighter mb-1">{promo.title}</h3>
                                    <p className="text-white/60 text-xs font-medium line-clamp-1">{promo.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* New Arrivals & Activity Hub */}
            <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* New Arrivals - Editorial List */}
                    <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-10 transition-colors duration-500 border border-transparent dark:border-gray-800">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter mb-2">New Arrivals</h2>
                                <div className="w-12 h-1 bg-[#d4af37] rounded-full"></div>
                            </div>
                            <Link href={route('buyer.shop')} className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] flex items-center gap-2 group/all">
                                View Full Collection
                                <ArrowRight className="w-3 h-3 transition-transform group-hover/all:translate-x-1" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {new_arrivals.slice(0, 4).map((product) => (
                                <Link key={product.id} href={route('buyer.shop')} className="flex items-center gap-6 group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                        {(product.image || product.solo_image || product.img) ? (
                                            <img 
                                                src={product.image || product.solo_image || product.img} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                alt={product.name} 
                                            />
                                        ) : (
                                            <span className="text-2xl opacity-20 group-hover:scale-110 transition-transform duration-500">🥐</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">{product.category?.name}</span>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors mb-1">{product.name}</h4>
                                        <p className="text-base font-medium text-gray-700 dark:text-gray-400">₱{parseFloat(product.price).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Notification & Activity Boxed Container */}
                    <div className="bg-white dark:bg-[#141414] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col h-full min-h-[500px] overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Updates & Activity</h3>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium tracking-wide">Latest signals from the artisanal vault.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10 py-12">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-white/5">
                                        <Bell className="w-8 h-8 text-gray-200 dark:text-gray-800" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-widest leading-relaxed">
                                        Silence in the gallery.<br/>Awaiting new masterpieces.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => markAsRead(notif.id)}
                                            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group relative ${
                                                notif.is_read 
                                                ? 'bg-transparent border-gray-50 dark:border-white/5 opacity-60' 
                                                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-[#d4af37]/30 shadow-sm'
                                            }`}
                                        >
                                            {!notif.is_read && (
                                                <div className="absolute top-5 right-5 w-2 h-2 bg-[#d4af37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                                            )}
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    notif.type === 'order' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                                                    notif.type === 'payment' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                                                    'bg-gray-100 text-gray-600 dark:bg-gray-800'
                                                }`}>
                                                    {notif.type === 'order' ? <Package className="w-5 h-5" /> : 
                                                     notif.type === 'payment' ? <CreditCard className="w-5 h-5" /> : 
                                                     <Tag className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col gap-1 pr-4">
                                                    <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">{notif.title}</h4>
                                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                                    <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                        {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-50 dark:border-white/5 text-center">
                            <button className="text-[9px] font-black text-gray-400 hover:text-[#d4af37] transition-colors uppercase tracking-[0.3em]">
                                Archive Exploration
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </BuyerLayout>
    );
}

const ProductCard = ({ product, onBuy, onToggleWishlist }: { product: any, onBuy?: () => void, onToggleWishlist?: (msg: string) => void }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLoved = isInWishlist(product.id);

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
            <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                {(product.image || product.solo_image || product.img) ? (
                    <img 
                        src={product.image || product.solo_image || product.img} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={product.name} 
                    />
                ) : (
                    <span className="text-5xl opacity-10 group-hover:scale-110 transition-transform duration-700"> baguette </span>
                )}
                
                {/* Wishlist Button - Connected and Detecting State */}
                <div className="absolute top-4 right-4 z-20">
                    <button 
                        onClick={() => {
                            const added = toggleWishlist({
                                id: product.id,
                                name: product.name,
                                price: parseFloat(product.price),
                                img: product.image || product.solo_image || product.img
                            });
                            
                            if (onToggleWishlist) {
                                if (added) {
                                    onToggleWishlist(`"${product.name}" has been curated.`);
                                } else {
                                    onToggleWishlist(`"${product.name}" removed from collection.`);
                                }
                            }
                        }}
                        title={isLoved ? "Remove from Wishlist" : "Add to Wishlist"}
                        className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden active:scale-90 border-2 ${isLoved ? 'bg-[#d4af37] border-[#d4af37] text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/30 hover:border-white/40'}`}
                    >
                        <svg 
                            className={`w-4 h-4 transition-all duration-700 ${isLoved ? 'scale-110 drop-shadow-md' : 'scale-100 opacity-80'}`} 
                            fill={isLoved ? "currentColor" : "none"} 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.2 10.7 19C5.8 14.5 2.5 11.5 2.5 7.8A4.8 4.8 0 0 1 7.3 3a5.3 5.3 0 0 1 4.7 2.6A5.3 5.3 0 0 1 16.7 3a4.8 4.8 0 0 1 4.8 4.8c0 3.7-3.3 6.7-8.2 11.2Z" />
                        </svg>
                    </button>
                </div>

                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-1 rounded text-[9px] font-bold text-gray-900 dark:text-white uppercase tracking-widest border border-white/20 dark:border-gray-700 shadow-sm">
                        {product.category?.name || 'Artisanal'}
                    </span>
                </div>
                {product.is_top_rated && (
                    <div className="absolute top-3 right-auto left-3 mt-8 bg-[#d4af37] text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm">
                        Gourmet Choice
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-[0.2em]">{product.category?.name || 'Artisanal'}</span>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full ${i < 4 ? 'bg-[#d4af37]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                        ))}
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-[#d4af37] transition-colors duration-500">{product.name}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">₱{parseFloat(product.price).toLocaleString()}</span>
                            {parseFloat(product.price) >= 5 && parseFloat(product.price) <= 15 && (
                                <span className="text-[8px] font-black text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded italic">x4</span>
                            )}
                        </div>
                        <span className="text-[7px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{parseFloat(product.price) >= 5 && parseFloat(product.price) <= 15 ? 'Artisanal Batch' : 'Market Valuation'}</span>
                    </div>
                    
                    <button 
                        onClick={onBuy}
                        className="px-6 py-3 bg-[#1c1917] dark:bg-white dark:text-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all duration-500 shadow-xl shadow-black/10 active:scale-95"
                    >
                        Acquire
                    </button>
                </div>
            </div>
        </div>
    );
};
