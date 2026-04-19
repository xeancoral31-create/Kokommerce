import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';

const ShoppingBagIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;

export default function BuyerShop({ products: dbProducts }: { products: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [notification, setNotification] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const products = dbProducts || [];
    const categories = ['All', ...new Set(products.map(p => p.category || 'Uncategorized'))];


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

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

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

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 transition-opacity duration-300 ${isFiltering ? 'opacity-0' : 'opacity-100'}`}>
                {currentProducts.map(product => (
                    <div key={product.id} className="buyer-card flex flex-col group cursor-pointer">
                        <div className="relative overflow-hidden rounded-[2.5rem] mb-8 aspect-square shadow-xl shadow-gray-200/50">
                            <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-x-4 bottom-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAddToBasket(product.name); }}
                                    className="w-full py-4 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#2d2a26] shadow-xl hover:bg-[#2d2a26] hover:text-white transition-all"
                                >
                                    Quick Add
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">{product.category}</span>
                            <span className="text-lg font-black text-[#2d2a26]">₱{product.price.toLocaleString()}</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2d2a26] group-hover:text-gold transition-colors tracking-tight leading-tight">{product.name}</h3>
                        <p className="text-sm text-gray-400 font-medium mt-3 mb-8 leading-relaxed">Masterfully baked using heirloom recipes and premium ingredients for a truly artisanal experience.</p>
                        <button 
                            onClick={() => handleAddToBasket(product.name)}
                            className="mt-auto w-full py-5 rounded-2xl border-2 border-[#2d2a26] font-black text-[10px] uppercase tracking-[0.2em] text-[#2d2a26] hover:bg-[#2d2a26] hover:text-white hover:shadow-2xl hover:shadow-black/20 transition-all leading-none"
                        >
                            Add to Basket
                        </button>
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
