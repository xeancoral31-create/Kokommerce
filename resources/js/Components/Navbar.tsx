import { Link, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";

import { 
    Bell, 
    Heart, 
    Moon, 
    Sun, 
    User, 
    MapPin, 
    Search, 
    Menu, 
    X,
    ChevronRight,
    ArrowRight,
    Check
} from "lucide-react";



import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { useTheme } from "../Context/ThemeContext";

const WishlistIcon = () => (
    <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
);

const MoonIcon = () => (
    <Moon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
);

const SunIcon = () => (
    <Sun className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45" />
);

const LocationPinIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AccountIcon = () => (
    <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
);

export default function Navbar() {
    const { url } = usePage();
    const { isLoaded, isSignedIn, user } = useUser();
    const { 
        cartCount, 
        cartItems, 
        removeFromCart, 
        updateVariant, 
        appliedVoucher, 
        deliveryDetails, 
        updateDeliveryDetails,
        isDetectingLocation,
        setIsDetectingLocation 
    } = useCart();
    const [showSideCart, setShowSideCart] = React.useState(false);

    const [cartAnimated, setCartAnimated] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);



    // Cart Bounce Animation Trigger
    useEffect(() => {
        if (cartCount > 0) {
            setCartAnimated(true);
            const timer = setTimeout(() => setCartAnimated(false), 600);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    // Scroll Observer for Fixed Elements
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);




    const isBuyer = url.startsWith('/buyer');
    const isFeatureDisabled = ['/', '/about', '/shop', '/offer'].includes(url);

    const [isViewingAsSeller, setIsViewingAsSeller] = React.useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view_as') === 'seller') {
            sessionStorage.setItem('view_as_seller', 'true');
            setIsViewingAsSeller(true);
        } else if (sessionStorage.getItem('view_as_seller') === 'true') {
            setIsViewingAsSeller(true);
        }
    }, [url]);

    const updateAddressFromCoords = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data) {
                let detailedLandmark = "Unknown Location";
                let city = "Butuan City";
                let state = "Agusan del Norte";
                let zip = "8600";
                
                if (data.address) {
                    const addr = data.address;
                    city = addr.city || addr.town || addr.municipality || city;
                    state = addr.region || addr.state || state;
                    zip = addr.postcode || zip;
                }

                if (data.display_name) {
                    const parts = data.display_name.split(',').map((p: string) => p.trim());
                    const localParts = parts.filter((p: string) => p !== city && p !== state && p !== zip && p !== "Philippines");
                    const uniqueLocalParts = Array.from(new Set([localParts[0], localParts[1]])).filter(Boolean);
                    if (uniqueLocalParts.length > 0) {
                        detailedLandmark = uniqueLocalParts.join(', ');
                        if (detailedLandmark.includes("BXU Resettlement Project")) {
                            detailedLandmark = detailedLandmark.replace("Ambago", "Upper Doongan");
                        }
                    }
                }
                
                const formulatedAddr = `${detailedLandmark}, ${city}, ${state} ${zip}`;
                updateDeliveryDetails({
                    address: formulatedAddr,
                    landmark: detailedLandmark,
                    city: city,
                    state: state,
                    zip: zip,
                    latitude: lat,
                    longitude: lng
                });
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        }
    };

    const handleDetectLocation = () => {
        setIsDetectingLocation(true);
        if ("geolocation" in navigator) {
            let bestAccuracy = Infinity;
            let attempts = 0;
            const maxAttempts = 3;

            const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
            const watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    attempts++;
                    if (accuracy < bestAccuracy) {
                        bestAccuracy = accuracy;
                        await updateAddressFromCoords(latitude, longitude);
                    }
                    if (accuracy <= 15 || attempts >= maxAttempts) {
                        navigator.geolocation.clearWatch(watchId);
                        setIsDetectingLocation(false);
                    }
                },
                (error) => {
                    console.error("GPS Error:", error);
                    setIsDetectingLocation(false);
                    navigator.geolocation.clearWatch(watchId);
                },
                options
            );
            setTimeout(() => {
                navigator.geolocation.clearWatch(watchId);
                setIsDetectingLocation(false);
            }, 20000);
        } else {
            setIsDetectingLocation(false);
        }
    };

    const handleReturnToDashboard = () => {
        sessionStorage.removeItem('view_as_seller');
        window.location.href = '/seller/dashboard';
    };

    // Artisanal Auth Bridge & Whitelist Sync
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const email = user.primaryEmailAddress?.emailAddress;
            const clerk_id = user.id;
            const image = user.imageUrl;
            const name = user.fullName || "Artisanal User";

            const hasSyncedThisSession = sessionStorage.getItem(`synced_${clerk_id}`);
            
            if (email && !hasSyncedThisSession) {
                axios.post('/auth/sync', { email, clerk_id, name, image })
                    .then(res => {
                        sessionStorage.setItem(`synced_${clerk_id}`, 'true');
                        if (res.data.redirect && !window.location.pathname.startsWith('/seller')) {
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

    const { wishlistItems } = useWishlist();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-24 transition-colors duration-500">
                <div className="container-custom h-full flex justify-between items-center w-full relative">
                    <Link href={isBuyer ? "/buyer/home" : "/"} className="flex items-center gap-4 group transition-transform hover:scale-105">
                        <Logo size={40} />
                        <div className="flex flex-col">
                            <span className="font-black text-xl text-gray-900 dark:text-white leading-none tracking-tighter">KOKOMMERCE</span>
                            <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-[0.4em] mt-1">Artisanal Bakery</span>
                        </div>
                    </Link>



                    <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#d4af37] ${url === link.href ? 'text-[#d4af37]' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 border-l border-gray-100 dark:border-gray-800 pl-8">
                            {/* Dark Mode Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="icon-nav-button flex items-center group focus:outline-none transition-all duration-500"
                                aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
                                title={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
                            >
                                <span className="text-gray-400 group-hover:text-[#d4af37] transition-colors">
                                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                </span>
                            </button>

                            {/* Wishlist Link */}
                            <Link 
                                href={isBuyer ? "/buyer/wishlist" : "/wishlist"} 
                                className="icon-nav-button relative flex items-center group focus:outline-none"
                                aria-label="Wishlist"
                                title="Wishlist"
                                data-discover="true"
                            >
                                <span className="text-gray-400 group-hover:text-[#d4af37] transition-colors"><WishlistIcon /></span>
                                {wishlistItems.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm transition-transform group-hover:scale-110"
                                    >
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Notification Icon (Only on Buyer/Seller routes, Hidden on disabled routes) */}
                            {isSignedIn && !isFeatureDisabled && (isBuyer || isViewingAsSeller) && (
                                <button
                                    className="icon-nav-button relative flex items-center group focus:outline-none text-gray-400"
                                    aria-label="Notifications"
                                    title="Notifications"
                                >
                                    <span className="group-hover:text-[#d4af37] transition-colors">
                                        <Bell className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                    </span>
                                </button>
                            )}


                            {/* Shopping Cart */}
                            <button 
                                onClick={() => !isFeatureDisabled && setShowSideCart(true)}
                                className={`icon-nav-button relative flex items-center group focus:outline-none ${cartAnimated ? 'animate-bounce' : ''} ${isFeatureDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Open Your Cart"
                                title={isFeatureDisabled ? "Cart accessible in Portal" : "Your Cart"}
                            >
                                <span className={`text-gray-400 group-hover:text-[#d4af37] transition-all duration-300 ${cartAnimated ? 'scale-125 text-[#d4af37]' : ''}`}>
                                    <i className="fa-solid fa-cart-arrow-down transition-transform duration-300 group-hover:scale-110"></i>
                                </span>
                                {cartCount > 0 && (
                                    <span
                                        className={`absolute -top-2 -right-2 bg-[#d4af37] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg transition-all duration-500 ${cartAnimated ? 'scale-125' : 'scale-100'} animate-pulse`}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Account Link (Far Right Anchor) */}
                            {isSignedIn && isBuyer && (
                                <Link 
                                    href="/buyer/account" 
                                    className={`icon-nav-button relative flex items-center group focus:outline-none ${url === '/buyer/account' ? 'text-[#d4af37]' : 'text-gray-400'}`}
                                    aria-label="Account"
                                    title="Account"
                                    data-discover="true"
                                >
                                    <span className="group-hover:text-[#d4af37] transition-colors">
                                        <AccountIcon />
                                    </span>
                                </Link>
                            )}

                            <div className="flex items-center gap-4">
                                {/* Returning Seller Dashboard Signal */}
                                {isViewingAsSeller && (
                                    <button
                                        onClick={handleReturnToDashboard}
                                        className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-white transition-all shadow-lg shadow-[#d4af37]/10"
                                    >
                                        Dashboard
                                    </button>
                                )}

                                <SignedIn>
                                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                                        <UserButton afterSignOutUrl="/" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-900 leading-none truncate max-w-[80px]">{user?.firstName || 'User'}</span>
                                            <span className="text-[7px] font-bold text-green-500 uppercase tracking-widest mt-0.5">Online</span>
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

            {/* Your Cart - Premium Side Drawer */}
            {showSideCart && (
                <div className="fixed inset-0 z-[1000] flex justify-end overflow-hidden">
                    <div
                        className="absolute inset-0 bg-[#2d2a26]/40 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setShowSideCart(false)}
                    />

                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-950 h-full shadow-[-20px_0_60px_rgba(0,0,0,0.05)] border-l border-gray-50 dark:border-gray-800 flex flex-col animate-in slide-in-from-right duration-500 ease-out transition-colors duration-500">
                        {/* Header */}
                        <div className="px-10 pt-16 pb-8 border-b border-gray-50 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 sticky top-0 z-10 backdrop-blur-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Your Cart</h2>
                                    <div className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></div>
                                        {cartCount} Item{cartCount !== 1 ? 's' : ''} in Cart
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowSideCart(false)}
                                    className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-90 group"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d4af37] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar bg-[#fdfcfb]/30 dark:bg-gray-950/30">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-800 mb-8 border border-gray-100 dark:border-gray-800">
                                        <i className="fa-solid fa-cart-arrow-down transition-transform duration-300 group-hover:scale-110"></i>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] leading-none mb-4">Your cart is empty</h3>
                                    <button onClick={() => setShowSideCart(false)} className="text-[#d4af37] font-black text-[9px] uppercase tracking-[0.3em] border-b-2 border-[#d4af37]/20 pb-1 hover:border-[#d4af37] transition-all">Go to Shop</button>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-8 group">
                                            <div className="w-28 h-28 rounded-[2rem] bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 relative shadow-inner border border-gray-50 dark:border-gray-700">
                                                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#d4af37] transition-colors tracking-tight uppercase leading-none">{item.name}</h3>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeFromCart(item.id);
                                                        }}
                                                        className="text-gray-200 dark:text-gray-700 hover:text-red-500 transition-all duration-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl group/trash-side"
                                                        title="Remove from Cart"
                                                    >
                                                        <svg className="w-4 h-4 transition-transform group-hover/trash-side:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center mb-4 mt-2">
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest italic opacity-60 leading-none">Order Item</p>
                                                    
                                                    <div className="flex bg-gray-50/80 dark:bg-gray-900/80 p-0.5 rounded-lg border border-gray-100/50 dark:border-gray-800">
                                                        <button 
                                                            onClick={() => updateVariant(item.id, 'Solo')}
                                                            className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all ${item.priceType === 'Solo' ? 'bg-white dark:bg-gray-800 text-[#d4af37] shadow-sm' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}
                                                        >
                                                            Solo
                                                        </button>
                                                        <button 
                                                            onClick={() => updateVariant(item.id, 'Package')}
                                                            className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all ${item.priceType === 'Package' ? 'bg-white dark:bg-gray-800 text-[#d4af37] shadow-sm' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}
                                                        >
                                                            Pkg
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-white/50 dark:bg-gray-900/50 p-2 pl-4 rounded-2xl border border-gray-50 dark:border-gray-800 group-hover:border-gray-100 dark:group-hover:border-gray-700 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-black text-gray-300 dark:text-gray-600 tracking-tighter">QTY</span>
                                                        <span className="text-sm font-black text-gray-900 dark:text-white">
                                                            {item.qty}
                                                            {item.isFixedQty && <span className="text-[#d4af37] ml-0.5">x</span>}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 dark:text-white pr-2">₱{(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="px-10 py-12 bg-white dark:bg-gray-950 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-2">Total Amount</span>
                                        <span className="text-[10px] text-gray-300 dark:text-gray-600 font-bold italic">Taxes and delivery added at checkout</span>
                                    </div>
                                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                        ₱{cartItems.reduce((acc, item) => {
                                            let discount = 0;
                                            if (appliedVoucher && item.id === appliedVoucher.product_id) {
                                                if (appliedVoucher.type === 'percentage') {
                                                    discount = item.price * item.qty * (appliedVoucher.discount_value / 100);
                                                } else {
                                                    discount = appliedVoucher.discount_value;
                                                }
                                            }
                                            return acc + (item.price * item.qty - discount);
                                        }, 0).toLocaleString()}
                                    </span>
                                </div>

                                {isSignedIn ? (
                                    <Link
                                        href="/buyer/cart"
                                        className="w-full bg-[#d4af37] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 active:scale-[0.98] shadow-xl shadow-[#d4af37]/20 hover:bg-black block"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                ) : (
                                    <SignInButton mode="modal" afterSignInUrl="/buyer/cart">
                                        <button className="w-full bg-[#d4af37] text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 active:scale-[0.98] shadow-xl shadow-[#d4af37]/20 hover:bg-black">
                                            Sign In to Checkout
                                        </button>
                                    </SignInButton>
                                )}

                                <div className="flex items-center justify-center gap-3 text-[9px] text-gray-300 dark:text-gray-600 font-black tracking-[0.4em] uppercase opacity-60">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Secure Transaction
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


        </>
    );
}

