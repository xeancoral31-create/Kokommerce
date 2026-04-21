import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';

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
    const [activeTab, setActiveTab] = React.useState('Discover');
    const [isBuyModalOpen, setIsBuyModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
    const [quantity, setQuantity] = React.useState(1);

    const openBuyModal = (product: any) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsBuyModalOpen(true);
    };

    const handleBuyNow = () => {
        // Here we could add to cart/order session then navigate
        window.location.href = route('buyer.payment');
    };

    const displayedProducts = activeTab === 'Discover' ? featured_products : recent_favorites;
    return (
        <BuyerLayout>
            <Head title="Artisanal Gallery - Home" />
            
            {/* Professional & Formal Hero Section */}
            <section className="relative mb-24 overflow-hidden rounded-[3rem] bg-[#1a1a1a] min-h-[500px] flex items-center">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=2000" 
                        alt="Bakery background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
                </div>
                
                <div className="relative z-10 px-16 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md bg-white/5 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></div>
                        <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">Welcome Back, {user_name}</span>
                    </div>
                    
                    <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8 italic">
                        The Art of <span className="text-[#d4af37]">Bakery</span> refined.
                    </h1>
                    
                    <p className="text-xl text-white/60 font-medium leading-relaxed mb-12 max-w-xl">
                        Experience the convergence of traditional heritage and modern artisanal mastery. Your exclusive selection is ready.
                    </p>
                    
                    <div className="flex gap-6">
                        <Link 
                            href={route('buyer.shop')}
                            className="px-12 py-6 bg-[#d4af37] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#d4af37]/20 hover:bg-[#b8962f] hover:-translate-y-1 transition-all"
                        >
                            Order Now
                        </Link>
                        <button className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
                            View Collections
                        </button>
                    </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute right-16 bottom-16 flex gap-8">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Active Offers</p>
                        <p className="text-white text-2xl font-black">{stats.available_offers}</p>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl">
                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Pending Orders</p>
                        <p className="text-white text-2xl font-black">{stats.recent_orders_count}</p>
                    </div>
                </div>
            </section>

            {/* Curated Selections - Tabbed Content */}
            <section className="mb-24">
                <div className="flex justify-between items-center mb-12 px-2">
                    <div className="flex gap-4">
                        {['Discover', 'Recent Favorites'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#2d2a26] text-white shadow-xl shadow-black/10' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <Link href={route('buyer.shop')} className="text-xs font-black uppercase tracking-widest text-[#d4af37] hover:text-black transition-colors">View All Products →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onBuy={() => openBuyModal(product)} 
                            />
                        ))
                    ) : (
                        <div className="lg:col-span-4 py-20 text-center bg-gray-50 rounded-[3rem]">
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No selections found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Buy Now Modal (Dark Professional UI) */}
            {isBuyModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsBuyModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#141414] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0 bg-white/5">
                                    <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                                </div>
                                <div className="max-w-[200px]">
                                    <h3 className="text-2xl font-black text-white tracking-tight mb-1">{selectedProduct.name}</h3>
                                    <p className="text-white/40 text-xs font-bold leading-relaxed truncate">{selectedProduct.category?.name} — ₱{parseFloat(selectedProduct.price).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setIsBuyModalOpen(false)} className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-white text-lg font-black tracking-tight">Quantity</p>
                                    <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-2 px-4">
                                        <button 
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#2563eb] transition-all text-2xl font-light"
                                        >
                                            —
                                        </button>
                                        <span className="text-white text-lg font-black w-6 text-center">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-[#2563eb] transition-all text-2xl font-light"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Current stock: <span className="text-white">{selectedProduct.stock || (Math.floor(Math.random() * 50) + 1)}</span></p>
                            </div>

                            <button 
                                onClick={handleBuyNow}
                                className="w-full py-6 bg-[#2563eb] text-white rounded-[2rem] text-sm font-black tracking-tight hover:bg-[#1d4ed8] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#2563eb]/20"
                            >
                                Buy now — ₱{(parseFloat(selectedProduct.price) * quantity).toLocaleString()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Promotions */}
            {promotions.length > 0 && (
                <section className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {promotions.map((promo) => (
                            <Link key={promo.id} href={route('buyer.offer')} className="group relative overflow-hidden rounded-[2.5rem] aspect-[16/10] bg-[#1a1a1a]">
                                <img src={promo.image || "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt={promo.title} />
                                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                    <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Limited Event</span>
                                    <h3 className="text-3xl font-black text-white tracking-tighter mb-2">{promo.title}</h3>
                                    <p className="text-white/60 text-sm font-medium line-clamp-1">{promo.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* New Arrivals - Editorial List */}
            <section className="mb-24">
                <div className="bg-gray-50 rounded-[3rem] p-16">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">New Arrivals</h2>
                        <div className="w-24 h-1 bg-[#d4af37] mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {new_arrivals.slice(0, 4).map((product) => (
                            <Link key={product.id} href={route('buyer.shop')} className="flex items-center gap-8 group">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:shadow-xl transition-all">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">{product.category?.name}</span>
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#d4af37] transition-colors mb-2">{product.name}</h4>
                                    <p className="text-lg font-black text-gray-900">₱{parseFloat(product.price).toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </BuyerLayout>
    );
}

const ProductCard = ({ product, onBuy }: { product: any, onBuy?: () => void }) => (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
            <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
            <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-gray-900 uppercase tracking-widest border border-white/20 shadow-sm">
                    {product.category?.name}
                </span>
            </div>
            {product.is_top_rated && (
                <div className="absolute top-4 right-4 bg-[#d4af37] text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                    Gourmet Choice
                </div>
            )}
        </div>
        
        <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-[#d4af37] transition-colors">{product.name}</h3>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">₱{parseFloat(product.price).toLocaleString()}</p>
                    <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'text-[#d4af37]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                </div>
                <button 
                    className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#d4af37] hover:text-white transition-all shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </button>
            </div>

            <button 
                onClick={onBuy}
                className="w-full py-4 bg-[#eca840]/10 text-[#eca840] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#eca840] hover:text-white transition-all"
            >
                Buy Now
            </button>
        </div>
    </div>
);
