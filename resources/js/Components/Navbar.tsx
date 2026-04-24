import { Link, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ShoppingBagIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

import { useCart } from "../Context/CartContext";

export default function Navbar() {
    const { url } = usePage();
    const { isLoaded, isSignedIn, user } = useUser();
    const { cartCount, cartItems, removeFromCart } = useCart();
    const [showSideCart, setShowSideCart] = React.useState(false);
    const isBuyer = url.startsWith('/buyer');

    const [isViewingAsSeller, setIsViewingAsSeller] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('search')) {
            setSearchTerm(params.get('search') || "");
        }
    }, [url]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view_as') === 'seller') {
            sessionStorage.setItem('view_as_seller', 'true');
            setIsViewingAsSeller(true);
        } else if (sessionStorage.getItem('view_as_seller') === 'true') {
            setIsViewingAsSeller(true);
        }
    }, [url]);

    const handleReturnToDashboard = () => {
        sessionStorage.removeItem('view_as_seller');
        window.location.href = '/seller/dashboard';
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetUrl = isBuyer ? "/buyer/shop" : "/shop";
        if (searchTerm.trim()) {
            Inertia.get(targetUrl, { search: searchTerm.trim() }, { preserveState: true });
        } else {
            Inertia.get(targetUrl);
        }
    };

    // Artisanal Auth Bridge & Whitelist Sync
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const email = user.primaryEmailAddress?.emailAddress;
            const clerk_id = user.id;
            const image = user.imageUrl;
            const name = user.fullName || "Artisanal User";

            const lastSynced = sessionStorage.getItem('last_clerk_sync');
            if (email && lastSynced !== email) {
                axios.post('/auth/sync', { email, clerk_id, name, image })
                    .then(res => {
                        sessionStorage.setItem('last_clerk_sync', email);
                        if (res.data.redirect) {
                            window.location.href = res.data.redirect;
                        }
                    })
                    .catch(err => console.error("Identity Sync Error:", err));
            }
        }
    }, [isLoaded, isSignedIn, user]);

    const navLinks = isBuyer ? [
        { name: "Home", href: "/buyer/home" },
        { name: "Shop", href: "/buyer/shop" },
        { name: "Offer", href: "/buyer/offer" },
        { name: "Orders", href: "/buyer/history" },
    ] : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Shop", href: "/shop" },
        { name: "Offer", href: "/offer" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-24">
            <div className="container-custom h-full flex justify-between items-center w-full">
                <Link href={isBuyer ? "/buyer/home" : "/"} className="flex items-center gap-4 group transition-transform hover:scale-105">
                    <Logo size={40} />
                    <div className="flex flex-col">
                        <span className="font-black text-xl text-gray-900 leading-none tracking-tighter">KOKOMMERCE</span>
                        <span className="text-[8px] font-black text-[#eca840] uppercase tracking-[0.4em] mt-1">Artisanal Bakery</span>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#eca840] ${url === link.href ? 'text-[#eca840]' : 'text-gray-500'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-8">
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-3 bg-[#fdfaf5] px-6 py-2.5 rounded-[1.5rem] border-2 border-[#fff8e6] group focus-within:bg-white focus-within:border-[#eca840]/30 focus-within:shadow-[0_8px_30px_rgba(236,168,64,0.08)] transition-all duration-500">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-xs font-black text-[#2d2a26] placeholder:text-gray-300 w-48 tracking-widest uppercase outline-none transition-all" 
                        />
                        <button type="submit" className="text-gray-300 group-focus-within:text-[#eca840] transition-colors focus:outline-none hover:scale-110 active:scale-95 duration-300">
                            <SearchIcon />
                        </button>
                    </form>

                    <div className="flex items-center gap-6 border-l border-gray-100 pl-8">
                        <button 
                            onClick={() => setShowSideCart(true)}
                            className="relative text-gray-400 hover:text-[#eca840] transition-colors focus:outline-none group"
                        >
                            <ShoppingBagIcon />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#eca840] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Returning Seller Dashboard Signal - Aligned with Profile */}
                            {isViewingAsSeller && (
                                <button
                                    onClick={handleReturnToDashboard}
                                    className="bg-[#eca840]/10 text-[#eca840] border border-[#eca840]/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#eca840] hover:text-white transition-all shadow-lg shadow-[#eca840]/10"
                                >
                                    Dashboard
                                </button>
                            )}

                            <SignedIn>
                                <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                                    <UserButton afterSignOutUrl="/" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-900 leading-none truncate max-w-[80px]">{user?.firstName || 'User'}</span>
                                        <span className="text-[7px] font-bold text-green-500 uppercase tracking-widest mt-0.5">Connected</span>
                                    </div>
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="bg-[#2d2a26] text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-900/10">Sign In</button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>
            {/* Artisanal Basket Modal */}
            {showSideCart && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
                    <div 
                        className="absolute inset-0 bg-[#2d2a26]/40 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setShowSideCart(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-500">
                        {/* Header */}
                        <div className="flex justify-between items-center px-10 py-8 border-b border-gray-50">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Your Artisanal Basket</h1>
                                <p className="text-[10px] font-bold text-[#eca840] uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#eca840] rounded-full animate-pulse"></div>
                                    {cartCount} Hand-crafted Selection{cartCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowSideCart(false)}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:bg-gray-50 group"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                                        <ShoppingBagIcon />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-300 uppercase tracking-widest leading-none">Your vault is empty</h3>
                                    <button onClick={() => setShowSideCart(false)} className="mt-6 text-[#eca840] font-black text-[10px] uppercase tracking-widest border-b-2 border-[#eca840]/20 pb-1 hover:border-[#eca840] transition-all">Explore the Gallery</button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-[2rem] hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
                                            <div className="w-24 h-24 rounded-3xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-black text-gray-900 group-hover:text-[#eca840] transition-colors tracking-tight uppercase leading-none">{item.name}</h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-200 hover:text-red-500 transition-colors p-1"
                                                        title="Remove from basket"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-gray-400 mb-4 line-clamp-1 font-medium italic">Hand-crafted Excellence</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-gray-100">
                                                        <span className="text-[10px] font-black text-gray-400">QTY</span>
                                                        <span className="text-xs font-black text-gray-900">{item.qty}</span>
                                                    </div>
                                                    <span className="text-base font-black text-gray-900">₱{(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="px-10 py-10 bg-gray-50/50 border-t border-gray-50 flex flex-col gap-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Estimated Total</span>
                                        <span className="text-[10px] text-gray-300 font-bold italic">Taxes and delivery calculated at checkout</span>
                                    </div>
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter">₱{cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        className="flex-1 bg-gray-200 text-gray-400 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] cursor-not-allowed border border-gray-300 transition-all shadow-sm"
                                        disabled
                                    >
                                        Payment Suspended
                                    </button>
                                    <button 
                                        onClick={() => setShowSideCart(false)}
                                        className="sm:w-max bg-white border border-gray-200 text-gray-900 px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                    >
                                        Continue Selection
                                    </button>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 font-bold tracking-widest uppercase">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    SECURE ARTISANAL TRANSACTIONS
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

