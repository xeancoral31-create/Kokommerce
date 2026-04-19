import { Link, usePage } from "@inertiajs/inertia-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";

const SearchIcon = () => (
    <svg className="search-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ShoppingBagIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);


const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default function Navbar() {


    const { url } = usePage();
    const { isLoaded, isSignedIn, user } = useUser();
    const isBuyer = url.startsWith('/buyer');

    const sellerWhitelist = [
        'xean.coral@urios.edu.ph',
        'xeancoral31@gmail.com',
        'John.santiago@urios.edu.ph'
    ];

    // Artisanal Auth Bridge & Whitelist Sync
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const email = user.primaryEmailAddress?.emailAddress;
            const clerk_id = user.id;
            const name = user.fullName || "Artisanal User";

            // Prevent infinite sync loops
            const lastSynced = sessionStorage.getItem('last_clerk_sync');
            const currentPath = window.location.pathname;

            if (email && lastSynced !== email) {
                axios.post('/auth/sync', { email, clerk_id, name })
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
        { name: "Order History", href: "/buyer/history" },
    ] : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Shop", href: "/shop" },
        { name: "Offer", href: "/offer" },
    ];

    return (
        <header className="navbar-koko">
            <div className="container-custom flex justify-between items-center w-full">
                <Link href={isBuyer ? "/buyer/home" : "/"} className="nav-logo flex items-center gap-3">
                    <Logo />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-900 leading-none tracking-tighter">KOKOMMERCE</span>
                      <span className="text-[7px] font-black text-[#eca840] uppercase tracking-[0.3em] mt-0.5">Artisanal Bakery</span>
                    </div>
                </Link>

                <nav className="nav-links">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className={url === link.href ? 'active' : ''}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>


                <div className="nav-actions">
                    <div className="search-box">
                        <input type="text" placeholder="Search artisanal treats..." />
                        <SearchIcon />
                    </div>

                    <div className="flex items-center space-x-6">
                        {isBuyer ? (
                            <Link href="/buyer/cart" className="icon-btn relative">
                                <ShoppingBagIcon />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
                            </Link>
                        ) : (
                            <div className="icon-btn relative cursor-default">
                                <ShoppingBagIcon />
                                <span id="cart-badge" className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                            </div>
                        )}

                        

                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <SignedOut>
                            <div className="auth-buttons flex items-center gap-4">
                                <SignInButton mode="modal">
                                    <button className="btn-nav-auth login">Sign In</button>
                                </SignInButton>
                            </div>

                        </SignedOut>


                    </div>
                </div>
            </div>
        </header>
    );
}
