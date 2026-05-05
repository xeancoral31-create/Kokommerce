import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const EmptyWishlistIcon = () => (
    <svg className="w-24 h-24 text-gray-100 dark:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ShoppingBagIcon = () => (
    <i className="fa-solid fa-cart-arrow-down"></i>
);

export default function Wishlist() {
    const { wishlistItems, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id + '_solo',
            original_id: item.id,
            name: item.name,
            price: item.price,
            solo_price: item.price,
            package_price: item.price * 0.9,
            qty: 1,
            img: item.img,
            priceType: 'Solo'
        });
        Inertia.visit('/buyer/cart');
    };

    return (
        <BuyerLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="text-center md:text-left">
                        <span className="text-[10px] font-[1000] text-[#eca840] uppercase tracking-[0.4em] mb-4 block">Your Curated Collection</span>
                        <h1 className="text-4xl lg:text-5xl font-black text-[#2d2a26] dark:text-white tracking-tighter leading-none uppercase">Wishlist</h1>
                    </div>
                    <Link 
                        href="/buyer/shop" 
                        className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-500">
                        <div className="mb-8 animate-bounce">
                            <EmptyWishlistIcon />
                        </div>
                        <h2 className="text-xl font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-300 dark:text-gray-700 text-sm max-w-md text-center mb-10 leading-relaxed font-bold">
                            Save your favorite artisanal treats here to easily find them later and bring a piece of our bakery home.
                        </p>
                        <Link 
                            href="/buyer/shop" 
                            className="text-[#eca840] font-black text-[11px] uppercase tracking-[0.4em] border-b-2 border-[#eca840]/20 pb-2 hover:border-[#eca840] transition-all"
                        >
                            Explore Our Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#eca840]/30 transition-all duration-700 hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2">
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={item.img} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Quick Actions */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                                        <button 
                                            onClick={() => toggleWishlist(item)}
                                            className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-xl active:scale-90 border border-white dark:border-gray-700"
                                            title="Remove from Wishlist"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-10 flex flex-col h-full">
                                    <div className="mb-6">
                                        <span className="text-[9px] font-black text-[#eca840] uppercase tracking-[0.3em] mb-2 block">Artisanal Choice</span>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:text-[#eca840] transition-colors duration-300">
                                            {item.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50 dark:border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1.5">Starting From</span>
                                            <span className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">
                                                ₱{item.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full py-5 bg-[#eca840] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-[#eca840]/20 hover:bg-[#d69635] hover:shadow-2xl hover:shadow-[#eca840]/40 transition-all active:scale-95"
                                    >
                                        <ShoppingBagIcon />
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BuyerLayout>
    );
}
