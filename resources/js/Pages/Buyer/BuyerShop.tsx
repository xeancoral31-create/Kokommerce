import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Inertia } from '@inertiajs/inertia';

const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;

export default function BuyerShop({ products: dbProducts }: { products: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [notification, setNotification] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [buyNowProduct, setBuyNowProduct] = useState<any | null>(null);
    const [buyNowQuantity, setBuyNowQuantity] = useState(1);
    const itemsPerPage = 6;

    const products = dbProducts || [];
    const coreCategories = ['All', 'Kakanin', 'Bread', 'Cookies', 'Cakes'];
    const dynamicCategories = [...new Set(products.map(p => p.category?.name || p.category))];
    const categories = [...new Set([...coreCategories, ...dynamicCategories])].filter(Boolean);


    const handleCategoryChange = (cat: string) => {
        setIsFiltering(true);
        setCurrentPage(1); // Reset to page 1 on filter
        setTimeout(() => {
            setSelectedCategory(cat);
            setIsFiltering(false);
        }, 300);
    };

    const handleAddToBasket = (productName: string) => {
        setNotification(`${productName} added to your basket.`);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleBuyNow = (product: any) => {
        setBuyNowProduct(product);
        setBuyNowQuantity(1);
    };

    const handleProceedToPayment = () => {
        if (!buyNowProduct) return;
        
        // Transform the single product into a cart item format
        const item = {
            id: buyNowProduct.id,
            name: buyNowProduct.name,
            price: buyNowProduct.price,
            qty: buyNowQuantity,
            img: buyNowProduct.image || buyNowProduct.img
        };

        // Redirect to delivery details with this item
        // Note: In a real app, this might be stored in session/cart, 
        // but here we'll pass it as props for demonstration as requested
        Inertia.get('/buyer/delivery', { 
            items: [item] 
        } as any);
    };

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => (p.category?.name || p.category) === selectedCategory);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <BuyerLayout>
            {/* Real-time Notification */}
            {notification && (
                <div className="fixed top-10 right-10 z-[1000] animate-in fade-in slide-in-from-right-10 duration-500">
                    <div className="bg-[#2d2a26] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">✓</div>
                        <span className="text-sm font-black tracking-tight">{notification}</span>
                    </div>
                </div>
            )}

            {/* Buy Now Modal */}
            {buyNowProduct && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
                        <div className="p-12">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-4xl font-black text-[#2d2a26] tracking-tight">Buy Now</h2>
                                    <p className="text-gray-400 font-bold mt-2">Almost fresh out the oven!</p>
                                </div>
                                <button onClick={() => setBuyNowProduct(null)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-8 mb-12 bg-gray-50/50 p-8 rounded-[2rem] border border-dashed border-gray-200">
                                <img src={buyNowProduct.image || buyNowProduct.img} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt="" />
                                <div>
                                    <h3 className="text-xl font-black text-[#2d2a26]">{buyNowProduct.name}</h3>
                                    <span className="text-2xl font-black text-[#eca840]">₱{parseFloat(String(buyNowProduct.price)).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Quantity</label>
                                <div className="flex items-center justify-between bg-[#fdfaf5] p-2 rounded-[2rem] border-2 border-[#fff8e6]">
                                    <button 
                                        onClick={() => setBuyNowQuantity(q => Math.max(1, q - 1))}
                                        className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-2xl font-black text-[#2d2a26] hover:bg-[#2d2a26] hover:text-white transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="text-3xl font-black text-[#2d2a26] tabular-nums">{buyNowQuantity}</span>
                                    <button 
                                        onClick={() => setBuyNowQuantity(q => q + 1)}
                                        className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-2xl font-black text-[#2d2a26] hover:bg-[#2d2a26] hover:text-white transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleProceedToPayment}
                                className="w-full bg-[#2d2a26] text-white py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                                <span>Proceed to Payment</span>
                                <span className="w-8 h-px bg-white/30 hidden sm:block"></span>
                                <span className="text-[#eca840]">₱{(buyNowProduct.price * buyNowQuantity).toLocaleString()}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border-b border-gray-100 py-6 -mx-8 -mt-8 mb-8 sticky top-[100px] z-40 backdrop-blur-md bg-white/90">
                <div className="container px-8 flex items-center justify-between">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-black transition-all whitespace-nowrap border-2 ${selectedCategory === cat ? 'bg-[#2d2a26] border-[#2d2a26] text-white' : 'bg-transparent border-gray-100 text-gray-400 hover:border-gold hover:text-gold'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 transition-opacity duration-300 ${isFiltering ? 'opacity-0' : 'opacity-100'}`}>
                {currentProducts.map(product => (
                    <div key={product.id} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img src={product.image || product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            
                            {/* Top Rated Badge from Screenshot */}
                            {(product.is_top_rated || product.rating >= 4.8) && (
                                <div className="absolute top-6 left-6 bg-[#eca840] text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-lg border border-[#eca840]">
                                    Top Rated
                                </div>
                            )}

                            <button className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                        </div>

                        <div className="p-10 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-[#eca840] transition-colors tracking-tight leading-tight">{product.name}</h3>
                                <div className="flex items-center text-[#eca840] text-[11px] font-black mt-1">
                                    <svg className="w-3 h-3 fill-current mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    {product.rating || '4.9'}
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-400 font-medium line-clamp-1 mb-8">
                                {product.description || "Masterfully baked using heirloom recipes and premium ingredients."}
                            </p>
                            
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-black text-[#2d2a26]">₱{parseFloat(String(product.price)).toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg italic">
                                        Stock: {product.stock || '10'} units
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleAddToBasket(product.name)}
                                        className="bg-gray-100 text-[#2d2a26] font-black py-4 px-4 rounded-2xl text-[10px] flex items-center justify-center gap-2 hover:bg-gray-200 transition-all uppercase tracking-widest border border-gray-200"
                                    >
                                        <ShoppingBagIcon />
                                        Cart
                                    </button>
                                    <button 
                                        onClick={() => handleBuyNow(product)}
                                        className="bg-[#eca840] text-white font-black py-4 px-4 rounded-2xl text-[10px] flex items-center justify-center gap-2 hover:bg-[#d69635] shadow-lg shadow-[#eca840]/20 transition-all active:scale-95 uppercase tracking-widest"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Artisanal Pagination */}
            {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-4">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-14 h-14 rounded-full text-lg font-black transition-all ${currentPage === i + 1 ? 'bg-[#f5a623] text-white shadow-xl shadow-[#f5a623]/30 scale-110' : 'bg-white border-2 border-gray-50 text-gray-300 hover:border-gold hover:text-gold'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}

            {filteredProducts.length === 0 && (
                <div className="py-40 text-center">
                    <h3 className="text-2xl font-black text-gray-300">No artisanal creations found in this category.</h3>
                </div>
            )}
        </BuyerLayout>
    );
}
