import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "@inertiajs/inertia-react";

const HeartIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
);

const HeritageStamp = () => (
    <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_30s_linear_infinite]">
            <path id="heritageCircle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
            <text className="text-[8px] font-black uppercase tracking-[0.3em] fill-current">
                <textPath xlinkHref="#heritageCircle">Artisanal • Heritage • Quality • Tradition •</textPath>
            </text>
        </svg>
    </div>
);

import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

import { Product } from "../types";

interface HomeProps {
    favorites: Product[];
    new_arrivals: Product[];
    categories: any[];
}

export default function Home({ favorites, new_arrivals, categories = [] }: HomeProps) {
    const [currentVideo, setCurrentVideo] = React.useState(0);

    // Ensure we have fallbacks for UI structure
    const displayNewArrivals = new_arrivals?.length > 0 ? new_arrivals : [];
    const displayFavorites = favorites?.length > 0 ? favorites : [];

    const firstCategory = categories[0];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section - Reverted to Professional Video/Static Background */}
                <section className="hero-section">
                    <div className="container-custom">
                        <div className="hero-banner relative overflow-hidden h-[500px] rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border border-gray-100">
                            <div className="hero-video-wrapper">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="hero-video-bg"
                                >
                                    <source src="/video/bakery video.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center px-8 md:px-16 lg:px-20">
                                <div className="hero-content">
                                    <span className="badge">Freshly Baked Daily</span>
                                    <h1 className="text-white drop-shadow-lg text-4xl lg:text-5xl font-black">The Hearth of <span className="text-[#eca840]">Tradition.</span></h1>
                                    <p className="text-white/80 drop-shadow-md text-sm lg:text-base max-w-lg">Heritage Crafted sourdough, heirloom pastries, and local delicacies delivered from our oven to your doorstep.</p>
                                    <div className="hero-btns mt-8">
                                        <Link href="/shop" className="btn-koko btn-primary bg-[#eca840] hover:bg-[#d69635] px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl">The Vault Collection</Link>
                                        <Link href="/about" className="btn-koko btn-outline ml-4 backdrop-blur-md px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 border-white/30 hover:border-white transition-all">Our Story</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Browse by Category - Professional Grid Aligned with Hero */}
                <section className="py-20 lg:py-24">
                    <div className="container-custom">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {categories.map((cat: any) => (
                                <Link
                                    key={cat.id}
                                    href={`/shop?category=${cat.name}`}
                                    className="group relative h-[400px] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
                                >
                                    {/* Background Image from Seller Portal */}
                                    {cat.image ? (
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                                            <span className="text-4xl opacity-20">✨</span>
                                        </div>
                                    )}

                                    <div className="relative h-full p-10 flex flex-col justify-end text-center">
                                        <div className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#eca840] group-hover:border-[#eca840] transition-all shadow-xl">
                                            <span className="text-xl text-white">
                                                {cat.name.toLowerCase() === 'kakanin' && '🍡'}
                                                {cat.name.toLowerCase() === 'bread' && '🥖'}
                                                {cat.name.toLowerCase() === 'cookies' && '🍪'}
                                                {cat.name.toLowerCase() === 'cakes' && '🍰'}
                                                {!['kakanin', 'bread', 'cookies', 'cakes'].includes(cat.name.toLowerCase()) && '✨'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-[0.3em] text-white transition-colors group-hover:text-[#eca840]">{cat.name}</h3>
                                        <p className="text-[9px] text-white/50 font-black mt-3 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">View Products</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
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
                            <span className="text-[11px] font-black uppercase tracking-widest">See All</span>
                            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#eca840] group-hover:text-white transition-all">
                                <ArrowRight />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-[600px]">
                        {/* Feature Large Card (Item 1) */}
                        <div className="lg:col-span-2 group relative overflow-hidden rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-white border border-gray-100 transition-all duration-1000 hover:-translate-y-3 flex items-center justify-center">
                            {displayNewArrivals[0] ? (
                                <>
                                    <div className="absolute inset-0">
                                        <img 
                                            src={displayNewArrivals[0].image || displayNewArrivals[0].solo_image || displayNewArrivals[0].img || "/images/placeholder.png"} 
                                            alt={displayNewArrivals[0].name} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                                    </div>
                                    
                                    <HeritageStamp />

                                    <div className="absolute inset-x-0 bottom-0 p-16 text-white">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#eca840] animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#eca840]">New Arrival</span>
                                            </div>
                                            <div className="h-4 w-px bg-white/20"></div>
                                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">{displayNewArrivals[0].category?.name || 'Artisanal'}</span>
                                        </div>
                                        
                                        <h3 className="text-6xl font-black tracking-tighter mb-6 group-hover:text-[#eca840] transition-colors duration-500 leading-none">{displayNewArrivals[0].name}</h3>
                                        <p className="text-white/60 text-lg max-w-xl font-medium line-clamp-2 leading-relaxed mb-10">{displayNewArrivals[0].description}</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Starting Price</span>
                                                <span className="text-4xl font-black tabular-nums tracking-tighter">₱{parseFloat(String(displayNewArrivals[0].price)).toLocaleString()}</span>
                                            </div>
                                            <Link href="/shop" className="group/btn flex items-center gap-4 px-12 py-6 bg-[#eca840] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl">
                                                <span>Buy Now</span>
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                    <button className="absolute top-10 right-10 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-red-500 transition-all duration-500 transform hover:scale-110">
                                        <HeartIcon className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-200 p-20 text-center">
                                    <div className="text-8xl mb-8 animate-bounce">🥐</div>
                                    <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Waiting for Products...</p>
                                </div>
                            )}
                        </div>

                        {/* Stacked Small Cards (Item 2 & 3) */}
                        <div className="flex flex-col gap-10">
                            {[1, 2].map((idx) => (
                                <div key={idx} className="flex-1 group relative overflow-hidden rounded-[3rem] bg-white border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                                    {displayNewArrivals[idx] ? (
                                        <div className="flex flex-col h-full p-4">
                                            <div className="relative h-48 overflow-hidden rounded-[2.5rem] bg-[#faf9f6]">
                                                <img 
                                                    src={displayNewArrivals[idx].image || displayNewArrivals[idx].solo_image || displayNewArrivals[idx].img || "/images/placeholder.png"} 
                                                    alt={displayNewArrivals[idx].name} 
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="text-[8px] font-black bg-white/90 backdrop-blur-md text-[#2d2a26] px-3 py-1.5 rounded-lg border border-white/20 shadow-sm uppercase tracking-widest">
                                                        {displayNewArrivals[idx].category?.name || 'Artisanal'}
                                                    </span>
                                                </div>
                                                <button className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <HeartIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="px-6 py-8 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black text-[#2d2a26] group-hover:text-[#eca840] transition-colors tracking-tighter mb-2 line-clamp-1 leading-none">{displayNewArrivals[idx].name}</h3>
                                                    <p className="text-[11px] text-gray-400 font-bold line-clamp-2 leading-relaxed">{displayNewArrivals[idx].description}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                                                    <span className="text-xl font-black text-[#2d2a26] tracking-tighter">₱{parseFloat(String(displayNewArrivals[idx].price)).toLocaleString()}</span>
                                                    <Link href="/shop" className="group/btn2 flex items-center gap-2 text-[9px] font-black text-[#eca840] uppercase tracking-[0.2em] hover:text-[#2d2a26] transition-colors">
                                                        <span>View</span>
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn2:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-50 text-gray-300 text-[10px] font-black uppercase tracking-[0.4em] p-12 text-center opacity-40">Coming Soon...</div>
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
                                    <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {(product.image || product.solo_image || product.img) ? (
                                            <img src={product.image || product.solo_image || product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <span className="text-6xl opacity-10">🎂</span>
                                        )}
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
                                        <p className="text-xs text-gray-400 font-medium line-clamp-1 mb-6">Made with premium ingredients.</p>
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
                                Enter Shop
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
