import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Inertia } from '@inertiajs/inertia';
import { useCart, CartItem } from '../../Context/CartContext';
import { usePage, Link } from '@inertiajs/inertia-react';
import { useWishlist } from '../../Context/WishlistContext';

import { Product } from '../../types';

declare var route: any;

import { ShoppingBag, Heart, Search, ChevronRight, ShoppingBasket, ArrowRight, Star } from 'lucide-react';

const ShoppingBagIcon = () => <ShoppingBag className="w-5 h-5" />;
const WishlistIcon = () => <Heart className="w-4 h-4" />;

export default function BuyerShop({ products: dbProducts, categories: dbCategories = [] }: { products: Product[], categories?: any[] }) {
    const { setItems, cartItems, addToCart } = useCart();
    const { url } = usePage();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [notification, setNotification] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const [priceType, setPriceType] = useState<'Solo' | 'Package'>('Solo');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const itemsPerPage = 12;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search') || '';
        if (search !== searchQuery) {
            setSearchQuery(search);
        }
    }, [url]);

    const getProductCategory = (p: Product) => {
        if (p.category?.name) return String(p.category.name);
        if (typeof p.category === 'string' && p.category) return p.category;

        const name = p.name ? p.name.toLowerCase() : '';
        if (name.includes('sourdough') || name.includes('bread') || name.includes('loaf') || name.includes('croissant') || name.includes('toast')) return 'Bread';
        if (name.includes('cookie') || name.includes('macadamia')) return 'Cookies';
        if (name.includes('cake') || name.includes('tiramisu') || name.includes('cheesecake') || name.includes('tart')) return 'Cakes';
        if (name.includes('kakanin') || name.includes('puto') || name.includes('bibingka') || name.includes('suman') || name.includes('biko') || name.includes('sapin')) return 'Kakanin';

        return 'Other';
    };

    const products = dbProducts || [];
    const coreCategories = ['All'];
    const dbCategoryNames = dbCategories.map(c => c.name);
    const dynamicCategories = [...new Set(products.map(p => getProductCategory(p)))].filter(Boolean);

    const categories = [...new Set([
        ...coreCategories,
        ...dbCategoryNames,
        ...dynamicCategories
    ])].filter(cat => cat !== 'Other');

    const handleCategoryChange = (cat: string) => {
        setIsFiltering(true);
        setCurrentPage(1);
        setTimeout(() => {
            setSelectedCategory(cat);
            setIsFiltering(false);
        }, 300);
    };

    const handleStatusChange = (status: string | null) => {
        setIsFiltering(true);
        setCurrentPage(1);
        setTimeout(() => {
            setSelectedStatus(status);
            setIsFiltering(false);
        }, 300);
    };

    const getProductImage = (p: Product, type?: 'Solo' | 'Package') => {
        if (type === 'Solo' && p.solo_image) return p.solo_image;
        if (type === 'Package' && p.package_image) return p.package_image;
        return p.image || p.img || p.solo_image || p.package_image || p.thumbnail || '/images/placeholder-artisanal.png';
    };

    const handleOpenSelection = (product: Product, initialType: 'Solo' | 'Package' = 'Solo') => {
        const soloPrice = product.solo_price ? parseFloat(String(product.solo_price)) : 0;
        const packagePrice = product.package_price ? parseFloat(String(product.package_price)) : (soloPrice * 0.9);
        const isSoloFixed4 = initialType === 'Solo' && soloPrice >= 5 && soloPrice <= 15;

        const cat = getProductCategory(product);

        const item: CartItem = {
            id: product.id + (initialType === 'Package' ? '_pkg' : '_solo'),
            original_id: product.id,
            name: `${product.name} (${initialType})`,
            price: initialType === 'Solo' ? soloPrice : packagePrice,
            solo_price: soloPrice,
            package_price: packagePrice,
            qty: isSoloFixed4 ? 4 : 1,
            img: getProductImage(product, initialType),
            priceType: initialType,
            category: cat,
            isFixedQty: isSoloFixed4
        };

        addToCart(item);
        Inertia.get('/buyer/cart');
    };

    const handleProceedToPayment = () => {
        if (!buyNowProduct) return;

        const cat = getProductCategory(buyNowProduct);
        const soloPrice = buyNowProduct.solo_price ? parseFloat(String(buyNowProduct.solo_price)) : 0;
        const packagePrice = buyNowProduct.package_price ? parseFloat(String(buyNowProduct.package_price)) : (soloPrice * 0.9);
        const isSoloFixed4 = priceType === 'Solo' && soloPrice >= 5 && soloPrice <= 15;

        const item: CartItem = {
            id: buyNowProduct.id + (priceType === 'Package' ? '_pkg' : '_solo'),
            original_id: buyNowProduct.id,
            name: `${buyNowProduct.name} (${priceType})`,
            price: priceType === 'Solo' ? soloPrice : packagePrice,
            solo_price: soloPrice,
            package_price: packagePrice,
            qty: isSoloFixed4 ? 4 : buyNowQuantity,
            img: getProductImage(buyNowProduct, priceType),
            priceType: priceType,
            category: cat,
            isFixedQty: isSoloFixed4
        };


        setItems([item]);
        Inertia.get('/buyer/delivery');
    };

    const handleModalAddToBag = () => {
        if (!buyNowProduct) return;

        const cat = getProductCategory(buyNowProduct);
        const soloPrice = buyNowProduct.solo_price ? parseFloat(String(buyNowProduct.solo_price)) : 0;
        const packagePrice = buyNowProduct.package_price ? parseFloat(String(buyNowProduct.package_price)) : (soloPrice * 0.9);
        const isSoloFixed4 = priceType === 'Solo' && soloPrice >= 5 && soloPrice <= 15;

        const newItem: CartItem = {
            id: buyNowProduct.id + (priceType === 'Package' ? '_pkg' : '_solo'),
            original_id: buyNowProduct.id,
            name: `${buyNowProduct.name} (${priceType})`,
            price: priceType === 'Solo' ? soloPrice : packagePrice,
            solo_price: soloPrice,
            package_price: packagePrice,
            qty: isSoloFixed4 ? 4 : buyNowQuantity,
            img: getProductImage(buyNowProduct, priceType),
            priceType: priceType,
            category: cat,
            isFixedQty: isSoloFixed4
        };


        setItems(prevItems => {
            const existing = prevItems.find(i => i.id === newItem.id);
            if (existing) {
                return prevItems.map(i => i.id === newItem.id ? { ...i, qty: i.qty + buyNowQuantity } : i);
            }
            return [...prevItems, newItem];
        });

        setNotification(`${buyNowProduct.name} (${priceType}) added to your bag.`);
        setBuyNowProduct(null);
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredProducts = products.filter(p => {
        const name = p.name ? p.name.toLowerCase() : '';
        const desc = p.description ? p.description.toLowerCase() : '';
        const cat = getProductCategory(p).toLowerCase();
        const search = searchQuery.toLowerCase().trim();

        const matchesSearch = !search || 
            name.includes(search) || 
            desc.includes(search) || 
            cat.includes(search);

        const matchesCategory = selectedCategory === 'All' || cat === selectedCategory.toLowerCase();
        
        const matchesStatus = !selectedStatus || p.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });


    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <BuyerLayout>
            {notification && (
                <div className="fixed top-12 right-12 z-[2000] animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="bg-[#141414] text-white px-10 py-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-6 border border-white/10 backdrop-blur-3xl">
                        <div className="w-14 h-14 rounded-2xl bg-[#eca840]/10 flex items-center justify-center text-[#eca840] border border-[#eca840]/20">
                            <ShoppingBasket className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.4em] mb-1">Concierge Note</span>
                            <span className="text-base font-bold tracking-tight text-white/90">{notification}</span>
                            {(notification.includes('curated') || notification.includes('added')) && (
                                <Link 
                                    href="/buyer/wishlist" 
                                    className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-3 hover:text-[#eca840] transition-all flex items-center gap-2 group/link"
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

            {buyNowProduct && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-[#1a1816]/60">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300 border border-white/20">
                        <div className="flex flex-col lg:flex-row h-full">
                            <div className="w-full lg:w-1/2 bg-[#fcfaf7] relative overflow-hidden group">
                                <img
                                    src={getProductImage(buyNowProduct, priceType)}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    alt={buyNowProduct.name}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-500 ${priceType === 'Solo' ? 'bg-[#eca840] scale-125' : 'bg-transparent'}`}></div>
                                        <div className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-500 ${priceType === 'Package' ? 'bg-[#eca840] scale-125' : 'bg-transparent'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">Product Type: {priceType}</span>
                                </div>
                            </div>

                            <div className="flex-1 p-10 lg:p-12 flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <span className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-1 block">Product Details</span>
                                        <h2 className="text-3xl font-black text-[#2d2a26] tracking-tighter leading-none">{buyNowProduct.name}</h2>
                                    </div>
                                    <button onClick={() => setBuyNowProduct(null)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className="space-y-8 flex-1">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Configuration</label>
                                            <span className="text-[8px] font-black text-[#eca840] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                                {priceType} Mode
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 bg-[#f8f9fa] p-6 rounded-[2rem] border border-gray-100">
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-[#2d2a26] tabular-nums tracking-tighter">₱{parseFloat(String(priceType === 'Solo' ? (buyNowProduct?.solo_price || 0) : (buyNowProduct?.package_price || 0))).toLocaleString()}</span>
                                                    <span className="text-[10px] font-black text-gray-400 capitalize">/{priceType === 'Solo' ? 'unit' : 'bundle'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Batch Control */}
                                    {buyNowProduct && priceType === 'Solo' && parseFloat(String(buyNowProduct.solo_price)) >= 5 && parseFloat(String(buyNowProduct.solo_price)) <= 15 ? (
                                         <div className="px-6 py-4 bg-[#fcfaf7] rounded-[1rem] border border-[#eca840]/20 flex items-center justify-center gap-3">
                                            <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.3em]">Fixed Artisanal Batch (4 Units)</span>
                                         </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-1">Specify Quantity</label>
                                            <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
                                                <button
                                                    onClick={() => setBuyNowQuantity(q => Math.max(1, q - 1))}
                                                    className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl font-black text-[#2d2a26] hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
                                                >−</button>
                                                <div className="flex items-baseline gap-1">
                                                    {buyNowProduct && priceType === 'Solo' && parseFloat(String(buyNowProduct.solo_price)) >= 5 && parseFloat(String(buyNowProduct.solo_price)) <= 15 && (
                                                        <span className="text-[10px] font-black text-[#eca840] tracking-tighter">4x</span>
                                                    )}
                                                    <span className="text-3xl font-black text-[#2d2a26] tabular-nums tracking-tighter">{buyNowQuantity}</span>
                                                </div>
                                                <button
                                                    onClick={() => setBuyNowQuantity(q => q + 1)}
                                                    className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl font-black text-[#2d2a26] hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-95"
                                                >+</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button
                                        onClick={handleModalAddToBag}
                                        className="flex-1 py-5 border-2 border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#2d2a26] hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                                    >To Bag</button>
                                    <button
                                        onClick={handleProceedToPayment}
                                        className="flex-[2] py-5 bg-[#eca840] text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#eca840]/20 hover:translate-y-[-2px] transition-all"
                                    >Buy Now ₱{((priceType === 'Solo' ? (buyNowProduct?.solo_price || 0) : (buyNowProduct?.package_price || 0)) * buyNowQuantity).toLocaleString()}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 mt-20 relative">
                {/* Formal Sidebar Navigation */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-[120px] space-y-8">
                        <div>
                            <span className="text-[10px] font-[1000] text-[#eca840] uppercase tracking-[0.4em] mb-4 block">Collection</span>
                            <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`group flex items-center justify-between px-6 py-3.5 rounded-[1rem] transition-all duration-500 border ${
                                            selectedCategory === cat 
                                            ? 'bg-[#2d2a26] border-[#2d2a26] text-white shadow-xl translate-x-2' 
                                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#eca840]/30 hover:text-[#eca840] hover:translate-x-1'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                                                selectedCategory === cat ? 'bg-[#eca840] scale-150' : 'bg-gray-200 group-hover:bg-[#eca840]/40'
                                            }`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{cat}</span>
                                        </div>
                                        {selectedCategory === cat && (
                                            <svg className="w-4 h-4 text-[#eca840] animate-in slide-in-from-left-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-[1000] text-[#eca840] uppercase tracking-[0.4em] mb-4 block">Availability</span>
                            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                {[
                                    { label: 'All Availability', value: null },
                                    { label: 'In Stock', value: 'in_stock' },
                                    { label: 'Pre-Order', value: 'pre_order' },
                                    { label: 'Sold Out', value: 'sold_out' }
                                ].map((status) => (
                                    <button
                                        key={status.label}
                                        onClick={() => handleStatusChange(status.value)}
                                        className={`group flex items-center justify-between px-6 py-3 rounded-[0.75rem] transition-all duration-500 border ${
                                            selectedStatus === status.value 
                                            ? 'bg-[#2d2a26] border-[#2d2a26] text-white shadow-lg translate-x-2' 
                                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#eca840]/30 hover:text-[#eca840] hover:translate-x-1'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                                                selectedStatus === status.value ? 'bg-[#eca840] scale-150' : 'bg-gray-200 group-hover:bg-[#eca840]/40'
                                            }`}></div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{status.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Formal Aesthetic Note */}
                        <div className="p-8 rounded-[2rem] bg-[#fcfaf7] dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group text-center">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#eca840]/5 rounded-full -mr-12 -mt-12 transition-transform duration-1000 group-hover:scale-110"></div>
                            <span className="text-[8px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-2 block relative z-10">Artisanal Promise</span>
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed relative z-10">
                                Curated for exceptional quality and traditional heritage.
                            </p>
                        </div>
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-black text-[#2d2a26] dark:text-white tracking-tighter uppercase leading-tight mb-2">
                                {selectedCategory === 'All' ? 'The Full Collection' : selectedCategory}
                            </h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="text-[#eca840]">{filteredProducts.length}</span> Masterpieces Found
                            </p>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${isFiltering ? 'opacity-30 translate-y-4 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
                        {currentProducts.map(product => (
                            <BuyerProductCard
                                key={product.id}
                                product={product}
                                onBuyNow={(type) => handleOpenSelection(product, type)}
                                onToggleWishlist={(msg) => {
                                    setNotification(msg);
                                    setTimeout(() => setNotification(null), 3000);
                                }}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="py-40 text-center bg-[#fcfaf7] dark:bg-gray-800/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">No selections curated yet.</h3>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:border-[#eca840] hover:text-[#eca840] transition-all disabled:opacity-30 active:scale-90"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-14 h-14 rounded-2xl text-[10px] font-black transition-all duration-500 ${
                                        currentPage === i + 1 
                                        ? 'bg-[#eca840] text-white shadow-2xl shadow-[#eca840]/30 scale-110' 
                                        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#eca840] hover:text-[#eca840]'
                                    }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-14 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:border-[#eca840] hover:text-[#eca840] transition-all disabled:opacity-30 active:scale-90"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </BuyerLayout>
    );
}

function BuyerProductCard({ product, onBuyNow, onToggleWishlist }: { product: any, onBuyNow: (type: 'Solo' | 'Package') => void, onToggleWishlist: (msg: string) => void }) {
    const [localPriceType, setLocalPriceType] = React.useState<'Solo' | 'Package'>('Solo');
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);

    const getProductCategory = (product: any) => {
        if (product.category?.name) return product.category.name;
        if (product.category_id) return String(product.category_id);
        return 'ARTISANAL';
    };

    const getProductImage = (p: any, type?: 'Solo' | 'Package') => {
        if (type === 'Solo' && p.solo_image) return p.solo_image;
        if (type === 'Package' && p.package_image) return p.package_image;
        return p.image || p.img || p.solo_image || p.package_image || p.thumbnail || '/images/placeholder-artisanal.png';
    };

    const isProductCake = getProductCategory(product).toLowerCase().includes('cake');

    const productSoloPrice = product.solo_price ? parseFloat(String(product.solo_price)) : 0;
    const isSoloFixed4 = localPriceType === 'Solo' && productSoloPrice >= 5 && productSoloPrice <= 15;

    return (
        <div className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-visible transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 hover:border-[#eca840]/30 min-h-[460px] hover:-translate-y-1.5">
            {product.stock <= 0 && (
                <div className="absolute inset-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[2rem] flex items-center justify-center pointer-events-none">
                    <div className="bg-[#2d2a26] dark:bg-black text-white text-[9px] font-black uppercase tracking-[0.4em] px-8 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl">
                        <svg className="w-4 h-4 text-[#eca840]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        Out of Stock
                    </div>
                </div>
            )}



            <div 
                className="relative aspect-[4/3] bg-[#fcfaf7] dark:bg-gray-800 overflow-hidden rounded-t-[2rem] cursor-pointer"
                onClick={() => onBuyNow(localPriceType)}
            >
                <img
                    src={getProductImage(product, localPriceType)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e: any) => {
                        e.target.src = '/images/placeholder-artisanal.png';
                    }}
                />

                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-5 right-5 flex flex-col gap-2 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const added = toggleWishlist({
                                id: product.id,
                                name: product.name,
                                price: parseFloat(String(localPriceType === 'Solo' ? (product.solo_price || 0) : (product.package_price || 0))),
                                img: getProductImage(product, localPriceType)
                            });

                            if (added) {
                                onToggleWishlist(`"${product.name}" has been curated.`);
                            } else {
                                onToggleWishlist(`"${product.name}" removed from collection.`);
                            }
                        }}
                        title="Add to Wishlist"
                        className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden active:scale-90 border-2 ${isWishlisted ? 'bg-[#eca840] border-[#eca840] text-white' : 'bg-white/95 dark:bg-gray-900/95 border-white dark:border-gray-800 text-gray-400 hover:text-[#eca840] hover:scale-105'}`}
                    >
                        <svg className={`w-4 h-4 transition-all duration-700 ${isWishlisted ? 'scale-110 drop-shadow-md' : ''}`} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.2 10.7 19C5.8 14.5 2.5 11.5 2.5 7.8A4.8 4.8 0 0 1 7.3 3a5.3 5.3 0 0 1 4.7 2.6A5.3 5.3 0 0 1 16.7 3a4.8 4.8 0 0 1 4.8 4.8c0 3.7-3.3 6.7-8.2 11.2Z" />
                        </svg>
                    </button>
                </div>

                <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                    <span className="text-[8px] self-start font-black text-white bg-black/60 backdrop-blur-md px-3 py-1.5 uppercase tracking-[0.3em] rounded border border-white/20 shadow-lg">
                        {getProductCategory(product)}
                    </span>
                    {product.status === 'pre_order' && (
                        <span className="text-[8px] self-start font-black text-white bg-blue-600 px-3 py-1.5 uppercase tracking-[0.3em] rounded border border-blue-400 shadow-lg">
                            Pre-Order
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-b-[1.5rem] z-10 relative">
                <h3 className="text-base font-black text-[#2d2a26] dark:text-white mb-2 tracking-tight group-hover:text-[#eca840] transition-colors duration-300">
                    {product.name}
                </h3>

                <p className="text-[10px] text-gray-400 font-bold leading-relaxed mb-4">
                    {product.description || "An artisanal masterpiece crafted with generational secrets."}
                </p>

                <div className="mt-auto">
                    <div className="mb-8 bg-gray-50/80 dark:bg-gray-800/80 p-1.5 rounded-[1rem] flex items-center border border-gray-100 dark:border-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative z-10">
                        <div 
                            className="absolute top-1.5 bottom-1.5 bg-white dark:bg-gray-900 rounded-[0.75rem] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                            style={{ 
                                left: localPriceType === 'Solo' ? '6px' : 'calc(50% + 3px)', 
                                width: 'calc(50% - 9px)' 
                            }}
                        />
                        
                        <button 
                        onClick={(e) => { e.stopPropagation(); setLocalPriceType('Solo'); }}
                        className={`relative z-10 flex-1 py-3 text-[9px] font-[1000] uppercase tracking-[0.25em] transition-colors duration-300 ${localPriceType === 'Solo' ? 'text-[#eca840]' : 'text-gray-400 dark:text-gray-500 hover:text-[#2d2a26] dark:hover:text-white'}`}>
                            {isProductCake ? 'Slice' : 'Solo'}
                        </button>
                        <button 
                        onClick={(e) => { e.stopPropagation(); setLocalPriceType('Package'); }}
                        className={`relative z-10 flex-1 py-3 text-[9px] font-[1000] uppercase tracking-[0.25em] transition-colors duration-300 ${localPriceType === 'Package' ? 'text-[#eca840]' : 'text-gray-400 dark:text-gray-500 hover:text-[#2d2a26] dark:hover:text-white'}`}>
                            {isProductCake ? 'Whole' : 'Package'}
                        </button>
                    </div>

                    {isSoloFixed4 && (
                         <div className="mb-8 px-4 py-3 bg-[#fcfaf7] dark:bg-gray-800 rounded-[1rem] border border-[#eca840]/20 flex items-center justify-center gap-3">
                            <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.2em]">Fixed Qty: 4</span>
                            <div className="w-1 h-1 rounded-full bg-[#eca840]/40"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Artisanal Solo</span>
                         </div>
                    )}

                    <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-100/50 dark:border-gray-800">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Price</span>
                            <div className="flex items-baseline gap-1">
                                {isSoloFixed4 && (
                                    <span className="text-[12px] font-black text-[#eca840] animate-pulse">4x</span>
                                )}
                                <span className="text-2xl font-black text-[#2d2a26] dark:text-white tabular-nums tracking-tighter leading-none">₱{parseFloat(String(localPriceType === 'Solo' ? (product.solo_price || 0) : (product.package_price || 0))).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Stock</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border transition-all ${product.stock < 5 ? 'text-red-500 bg-red-400/10 border-red-200' : 'text-[#2d2a26] dark:text-gray-300 bg-[#fcfaf7] dark:bg-gray-800 border-gray-200/60 dark:border-gray-700'}`}>
                                {product.stock} Units
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); onBuyNow(localPriceType); }}
                            disabled={product.stock <= 0}
                            className={`flex-[1.2] py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 disabled:opacity-0 border-2 flex items-center justify-center gap-2.5 group/basket ${localPriceType === 'Solo' ? 'border-gray-200 dark:border-gray-700 text-[#2d2a26] dark:text-white hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black hover:shadow-xl shadow-black/10' : 'border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-solid hover:border-gray-900 dark:hover:border-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black hover:shadow-xl shadow-black/10'}`}
                        >
                            <ShoppingBasket className="w-4 h-4 transition-transform duration-300 group-hover/basket:-translate-y-0.5" />
                            <span className="hidden sm:inline">Add to Bag</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onBuyNow(localPriceType); }}
                            disabled={product.stock <= 0}
                            className="flex-[2] py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 active:scale-95 disabled:opacity-0 bg-[#eca840] text-white shadow-lg shadow-[#eca840]/20 hover:bg-[#d69635] hover:shadow-2xl hover:shadow-[#eca840]/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/buy"
                        >
                            Buy Now
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/buy:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
