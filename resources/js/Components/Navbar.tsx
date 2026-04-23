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
    const { cartCount } = useCart();
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
                        {isBuyer ? (
                            <Link href="/buyer/cart" className="relative text-gray-400 hover:text-gray-900 transition-colors">
                                <ShoppingBagIcon />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <div className="relative text-gray-400 cursor-help">
                                <ShoppingBagIcon />
                                <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-500 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">0</span>
                            </div>
                        )}

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
        </header>
    );
}

