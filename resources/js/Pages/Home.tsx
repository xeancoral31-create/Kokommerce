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

export default function Home() {
    const [currentVideo, setCurrentVideo] = React.useState(0);
    const videos = [
        "https://www.youtube.com/watch?v=_om7--IxCIY", // New user-requested cinematic video
        "https://player.vimeo.com/external/434045526.sd.mp4?s=c27dbed9a95719e7100b55502bcbe386f6854b73&profile_id=164&oauth2_token_id=57447761",
        "https://player.vimeo.com/external/481541014.sd.mp4?s=d01073160866bbf8e41bf165842c5545a995209c&profile_id=165&oauth2_token_id=57447761",
        "https://player.vimeo.com/external/482062325.sd.mp4?s=990924ec9d816f0f5b10ce09f2911244e8dd627b&profile_id=165&oauth2_token_id=57447761",
    ];

    const nextVideo = () => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

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



                {/* New Arrivals */}
                <section className="container-custom py-12">
                    <div className="section-header">
                        <div className="title-group">
                            <h2>New Arrivals</h2>
                            <p>Latest treasures from our kitchen.</p>
                        </div>
                        <Link href="/shop" className="view-all">View All <ArrowRight /></Link>
                    </div>


                    <div className="grid-arrivals">
                        <div className="product-card h-full">
                            <div className="img-wrapper h-full">
                                <img src="/images/products/ube-cake.png" alt="Signature Ube Halaya Cake" />
                            </div>
                            <button className="wish-btn"><HeartIcon /></button>
                            <div className="card-content absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
                                <span className="text-sm font-bold text-[#eca840]">TRENDING</span>
                                <h3 className="text-2xl font-bold mt-1">Signature Ube Halaya Cake</h3>
                                <p className="text-sm opacity-80 mt-2">Triple-layered purple yam cake with authentic macapuno strings.</p>
                                <p className="text-2xl font-bold mt-4">₱1,250</p>
                            </div>
                        </div>
                        <div className="arrivals-right">
                            <div className="product-card">
                                <div className="flex h-full">
                                    <div className="img-wrapper w-1/2">
                                        <img src="/images/products/sourdough.png" alt="Country Sourdough" />
                                    </div>
                                    <div className="p-6 w-1/2">
                                        <h3 className="font-bold">Country Sourdough</h3>
                                        <p className="desc mt-1">72-hour fermented wild yeast...</p>
                                        <p className="price mt-4">₱320</p>
                                    </div>
                                </div>
                            </div>
                            <div className="product-card">
                                <div className="flex h-full">
                                    <div className="img-wrapper w-1/2">
                                        <img src="/images/products/cookies.png" alt="Sea Salt Choco Cookies" />
                                    </div>
                                    <div className="p-6 w-1/2">
                                        <h3 className="font-bold">Sea Salt Choco</h3>
                                        <p className="desc mt-1">Rich Belgian dark chocolate...</p>
                                        <p className="price mt-4">₱450 / 6pcs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* All-Time Favorites */}
                <section className="container-custom py-12 mb-12">
                    <div className="section-header text-center block">
                        <div className="title-group mx-auto">
                            <h2 className="text-center">All-Time Favorites</h2>
                            <p className="text-center">The classics that keep our customers coming back.</p>
                        </div>
                    </div>

                    <div className="grid-products mt-8">
                        {[
                            { name: "Golden Cheese Ensaymada", price: "₱85.00", rating: "4.8 (2k+)", img: "/images/products/ensaymada.png" },
                            { name: "Custard Cassava Cake", price: "₱420.00", rating: "4.9 (1.5k)", img: "/images/products/cassava-cake-v2.png" },
                            { name: "Artisan Pandesal", price: "₱120.00", rating: "5.0 (5k+)", img: "/images/products/pandesal-v2.png" },
                            { name: "Triple Dark Truffle", price: "₱1,400.00", rating: "4.9 (3k)", img: "/images/products/dark-truffle.png" },
                        ].map((product) => (
                            <div key={product.name} className="product-card">
                                <div className="img-wrapper">
                                    <img src={product.img} alt={product.name} />
                                </div>
                                <button className="wish-btn"><HeartIcon /></button>
                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>{product.name}</h3>
                                    </div>
                                    <p className="desc">Handcrafted with care</p>
                                    <div className="card-footer">
                                        <p className="price">{product.price}</p>
                                        <p className="rating">★ {product.rating}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
