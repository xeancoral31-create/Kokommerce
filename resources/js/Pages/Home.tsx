import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "@inertiajs/inertia-react";

const HeartIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
);

const ArrowRight = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
);

import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    rating: string | number;
    category?: { name: string };
    image: string;
    is_top_rated?: boolean;
    reviews_count?: number;
}

interface HomeProps {
    favorites: Product[];
    new_arrivals: Product[];
}

export default function Home({ favorites, new_arrivals }: HomeProps) {
    const [currentVideo, setCurrentVideo] = React.useState(0);
    
    // Ensure we have fallbacks for UI structure
    const displayNewArrivals = new_arrivals?.length > 0 ? new_arrivals : [];
    const displayFavorites = favorites?.length > 0 ? favorites : [];

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section with High-Definition Video Background */}
                <section className="hero-section container-custom">
                    <div className="hero-banner video-mode">
                        <div className="hero-video-wrapper">
                            <iframe 
                                src={`https://www.youtube.com/embed/_om7--IxCIY?autoplay=1&mute=1&controls=0&loop=1&playlist=_om7--IxCIY&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&origin=${window.location.origin}`}
                                className="hero-iframe-bg"
                                allow="autoplay; encrypted-media"
                                frameBorder="0"
                            ></iframe>
                        </div>
                        <div className="hero-overlay">
                            <div className="hero-content">
                                <span className="badge">Freshly Baked Daily</span>
                                <h1>The Hearth of <span>Tradition.</span></h1>
                                <p>Handcrafted sourdough, heirloom pastries, and local delicacies delivered from our oven to your doorstep.</p>
                                <div className="hero-btns">
                                    <Link href="/shop" className="btn-koko btn-primary">Explore Menu</Link>
                                    <Link href="/about" className="btn-koko btn-outline">Our Story</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Browse by Category - Global Detection */}
                <section className="container-custom py-24">
                    <div className="flex flex-wrap justify-center gap-8">
                        {['Kakanin', 'Bread', 'Cookies', 'Cakes'].map((cat) => (
                            <Link 
                                key={cat}
                                href={`/shop?category=${cat}`} 
                                className="group flex-1 min-w-[200px] bg-white rounded-[2.5rem] p-8 border border-gray-100 transition-all hover:shadow-2xl hover:border-[#eca840] hover:-translate-y-2 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#eca840]/10 transition-all">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">
                                        {cat === 'Kakanin' && '🍡'}
                                        {cat === 'Bread' && '🥖'}
                                        {cat === 'Cookies' && '🍪'}
                                        {cat === 'Cakes' && '🍰'}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-[#eca840] transition-colors">{cat}</h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Explore Collections</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* New Arrivals - Professional 3-Item Layout */}
                <section className="container-custom py-24">
                    <div className="section-header mb-16">
                        <div className="title-group">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[2px] bg-[#eca840]"></span>
                                <span className="text-[10px] font-black text-[#eca840] uppercase tracking-[0.4em]">Latest From Oven</span>
                            </div>
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">New Arrivals</h2>
                            <p className="text-gray-400 mt-4 max-w-lg font-medium">Be the first to experience our newest artisanal creations, masterfully crafted by our head baker.</p>
                        </div>
                        <Link href="/shop" className="view-all group">
                           <span className="text-[11px] font-black uppercase tracking-widest">Discover All</span>
                           <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#eca840] group-hover:text-white transition-all">
                             <ArrowRight />
                           </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-[600px]">
                        {/* Feature Large Card (Item 1) */}
                        <div className="lg:col-span-2 group relative overflow-hidden rounded-[3rem] shadow-2xl bg-gray-50 border border-gray-100 transition-all duration-700 hover:-translate-y-2">
                            {displayNewArrivals[0] ? (
                                <>
                                    <img src={displayNewArrivals[0].image} alt={displayNewArrivals[0].name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-x-0 bottom-0 p-12 text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="bg-[#eca840] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">New Arrival</span>
                                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{displayNewArrivals[0].category?.name}</span>
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tight mb-4 group-hover:text-[#eca840] transition-colors">{displayNewArrivals[0].name}</h3>
                                        <p className="text-white/60 text-sm max-w-xl font-medium line-clamp-2 leading-relaxed mb-6">{displayNewArrivals[0].description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-black">₱{parseFloat(String(displayNewArrivals[0].price)).toLocaleString()}</span>
                                            <Link href="/shop" className="px-10 py-5 bg-white text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#eca840] hover:text-white transition-all shadow-xl">Order Now</Link>
                                        </div>
                                    </div>
                                    <button className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-[#eca840] hover:border-[#eca840] transition-all">
                                        <HeartIcon />
                                    </button>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest">Detecting Creations...</div>
                            )}
                        </div>

                        {/* Stacked Small Cards (Item 2 & 3) */}
                        <div className="flex flex-col gap-10">
                            {[1, 2].map((idx) => (
                                <div key={idx} className="flex-1 group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:-translate-y-1">
                                    {displayNewArrivals[idx] ? (
                                        <div className="flex flex-col h-full">
                                            <div className="h-1/2 overflow-hidden relative">
                                                <img src={displayNewArrivals[idx].image} alt={displayNewArrivals[idx].name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                <span className="absolute top-6 right-6 text-[8px] font-black bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-lg border border-white/20 shadow-sm uppercase">{displayNewArrivals[idx].category?.name}</span>
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#eca840] transition-colors tracking-tight mb-2 line-clamp-1">{displayNewArrivals[idx].name}</h3>
                                                    <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{displayNewArrivals[idx].description}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-6">
                                                    <span className="text-lg font-black text-gray-900">₱{parseFloat(String(displayNewArrivals[idx].price)).toLocaleString()}</span>
                                                    <Link href="/shop" className="text-[10px] font-extrabold text-[#eca840] uppercase tracking-widest underline underline-offset-8 decoration-2 hover:text-[#d69635]">View Detail</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 text-gray-300 text-[10px] font-black uppercase tracking-widest p-12 text-center">Waiting for Head Baker...</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All-Time Favorites - Dynamic Social Data */}
                <section className="bg-gray-50/50 py-32">
                    <div className="container-custom">
                        <div className="section-header text-center block mb-20">
                            <div className="title-group mx-auto max-w-2xl">
                                <h2 className="text-center text-5xl font-black text-gray-900 tracking-tighter mb-6">All-Time Favorites</h2>
                                <p className="text-center text-gray-400 font-medium leading-relaxed italic">"The artisanal classics that defined our bakery. Handcrafted using heirloom recipes that have stood the test of time."</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {displayFavorites.map((product) => (
                                <div key={product.id} className="product-card group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <button className="absolute top-6 right-6 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 transition-all scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                                            <HeartIcon />
                                        </button>
                                        <span className="absolute bottom-6 left-6 text-[10px] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white font-black text-gray-600 uppercase tracking-widest shadow-sm">{product.category?.name}</span>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                          <h3 className="text-lg font-black text-gray-900 group-hover:text-[#eca840] transition-colors tracking-tight leading-tight line-clamp-2">{product.name}</h3>
                                          <div className="flex items-center mt-1">
                                            <span className="text-[10px] font-black text-[#eca840]">★ {product.rating}</span>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium line-clamp-1 mb-6">Masterfully baked with artisanal precision.</p>
                                        <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                                            <p className="text-xl font-black text-gray-900 tracking-tighter">₱{parseFloat(String(product.price)).toLocaleString()}</p>
                                            <Link href="/shop" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#eca840] hover:bg-[#eca840] hover:text-white transition-all">
                                              <ArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-20 text-center">
                           <Link href="/shop" className="inline-flex items-center gap-4 bg-[#2d2a26] text-white px-12 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
                             Enter the Full Gallery 
                             <ArrowRight />
                           </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
