import React from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useWishlist } from '../../Context/WishlistContext';
import { useNotifications } from '../../Context/NotificationContext';
import { Bell, Package, CreditCard, Tag, CheckCircle } from 'lucide-react';
import L from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

interface BuyerAccountProps {
    buyer: any;
    orders_count?: number;
    offers_count?: number;
}

export default function BuyerAccount({ buyer, orders_count = 0, offers_count = 0 }: BuyerAccountProps) {
    const { auth_user, auth } = usePage().props as any;
    const { isLoaded, isSignedIn, user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const { wishlistItems } = useWishlist();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const user = auth_user || auth?.user || buyer;
    
    // Use Clerk image if available for real-time sync
    const displayImage = clerkUser?.imageUrl || user?.profile_image_url || user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'Gourmet'}&background=d4af37&color=fff`;
    const displayName = clerkUser?.fullName || user?.name || 'Honored Guest';
    const displayEmail = clerkUser?.primaryEmailAddress?.emailAddress || user?.email || 'guest@kokommerce.com';

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUpdatingImage, setIsUpdatingImage] = React.useState(false);

    const [activeTab, setActiveTab] = React.useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'overview';
    });
    const [is2FAEnabled, setIs2FAEnabled] = React.useState(true);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
    
    // Location Detection States
    const [isDetecting, setIsDetecting] = React.useState(false);
    const [detectedCoords, setDetectedCoords] = React.useState<{lat: number, lng: number} | null>(null);
    const [primaryAddress, setPrimaryAddress] = React.useState(buyer?.address || '123 Gourmet Lane, Artisanal District, PH'); // Default from UI
    const [isLocationVerified, setIsLocationVerified] = React.useState(false);

    // Leaflet Map Refs
    const mapRef = React.useRef<HTMLDivElement>(null);
    const mapInstance = React.useRef<L.Map | null>(null);
    const markerRef = React.useRef<L.Marker | null>(null);

    // Profile States for Sync
    const [fullName, setFullName] = React.useState(buyer?.name || displayName);
    const [email, setEmail] = React.useState(buyer?.email || displayEmail);
    const [phone, setPhone] = React.useState(buyer?.phone || '+63 912 345 6789');

    // Sync states when Clerk or User data changes
    React.useEffect(() => {
        if (isLoaded) {
            setFullName(displayName);
            setEmail(displayEmail);
        }
    }, [isLoaded, displayName, displayEmail]);
    // Leaflet Map Initialization & Sync
    React.useEffect(() => {
        if (!mapRef.current) return;
        const center = detectedCoords ? [detectedCoords.lat, detectedCoords.lng] : [8.9475, 125.5406];

        if (!mapInstance.current) {
            // Initializing map with a professional grayscale-muted theme
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView(center as L.LatLngExpression, detectedCoords ? 16 : 13);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
            }).addTo(mapInstance.current);

            // Adding a sophisticated gold zoom control
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        } else if (detectedCoords) {
            mapInstance.current.setView([detectedCoords.lat, detectedCoords.lng], 16);
        }

        // Custom Artisanal Gold Marker
        const goldIcon = L.divIcon({
            className: 'custom-gold-marker',
            html: `<div class="w-8 h-8 bg-[#d4af37] rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        if (detectedCoords) {
            if (markerRef.current) {
                markerRef.current.setLatLng([detectedCoords.lat, detectedCoords.lng]);
            } else {
                markerRef.current = L.marker([detectedCoords.lat, detectedCoords.lng], { icon: goldIcon }).addTo(mapInstance.current);
            }
        }

        return () => {
            // Cleanup logic is handled by instance check to avoid flickering
        };
    }, [detectedCoords]);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setDetectedCoords({ lat: latitude, lng: longitude });
                
                try {
                    // Sophisticated reverse geocoding to match Navbar logic
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
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
                                detailedLandmark = uniqueLocalParts.join(' / ');
                                if (detailedLandmark.includes("BXU Resettlement Project")) {
                                    detailedLandmark = detailedLandmark.replace("Ambago", "Upper Doongan");
                                }
                            }
                        }
                        
                        const formulatedAddr = `${detailedLandmark}, ${city}, ${state}, ${zip}`;
                        setPrimaryAddress(formulatedAddr);
                        setIsLocationVerified(true);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                    }
                } catch (error) {
                    console.error("Geocoding failed", error);
                } finally {
                    setIsDetecting(false);
                }
            },
            (error) => {
                console.error("Geolocation error", error);
                alert("Failed to detect location. Please ensure location services are enabled.");
                setIsDetecting(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'notifications', label: 'Updates & Activity', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { id: 'details', label: 'Account Details', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.put('/buyer/account', {
            name: fullName,
            email: email,
            phone: phone,
            address: primaryAddress
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setActiveTab('overview');
                }, 1500);
            }
        });
    };

    const handleTerminateAccount = () => {
        if (confirm("Are you sure you want to terminate your account? This artisanal journey cannot be recovered.")) {
            // Simulated termination
            alert("Account termination process initiated.");
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!isSignedIn || !clerkUser) {
            alert("Please sign in to update your profile image.");
            return;
        }

        try {
            setIsUpdatingImage(true);
            await clerkUser.setProfileImage({ file });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile image", err);
            alert("Failed to update profile image. Please try again.");
        } finally {
            setIsUpdatingImage(false);
        }
    };

    const handleSignOut = async () => {
        if (confirm("Are you sure you want to sign out?")) {
            try {
                await signOut();
                Inertia.post('/logout');
            } catch (error) {
                console.error("Sign out failed:", error);
                Inertia.post('/logout');
            }
        }
    };

    return (
        <BuyerLayout>
            <Head title="Kokommerce - Account" />
            
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
                
                {showSuccess && (
                    <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
                        <div className="bg-[#d4af37] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            <span className="font-bold tracking-tight">Profile Updated Successfully</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar — Glassmorphism Editorial Navigation */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-32 space-y-6">
                            {/* Profile Identity Card */}
                            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 backdrop-blur-xl">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d4af37]/20 p-1 group-hover:border-[#d4af37]/40 transition-all duration-500 relative">
                                            <img 
                                                src={displayImage} 
                                                alt="Profile" 
                                                className={`w-full h-full object-cover rounded-full ${isUpdatingImage ? 'opacity-50' : ''}`}
                                            />
                                            {isUpdatingImage && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                        />
                                        <button 
                                            onClick={handleImageClick}
                                            disabled={isUpdatingImage}
                                            className="absolute bottom-0 right-0 w-8 h-8 bg-[#d4af37] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#1a1a1a] hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </button>
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white tracking-tight">{displayName}</h2>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-4">{displayEmail}</p>
                                    <div className="px-4 py-1.5 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20">
                                        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Platinum Member</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-white/5">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                                            activeTab === item.id 
                                            ? 'bg-[#d4af37] text-white shadow-[0_10px_20px_rgba(212,175,55,0.2)]' 
                                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#d4af37]'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 transition-transform group-hover:scale-110`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        {item.label}
                                    </button>
                                ))}
                                <div className="my-4 border-t border-gray-50 dark:border-white/5 mx-6"></div>
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area — Dynamic Views */}
                    <div className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            
                            {activeTab === 'overview' && (
                                <div className="space-y-10">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { id: 'orders', label: 'Total Purchase', value: orders_count.toString().padStart(2, '0'), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', href: '/buyer/history' },
                                            { id: 'wishlist', label: 'Collection Count', value: wishlistItems.length.toString().padStart(2, '0'), icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', href: '/buyer/wishlist' },
                                            { id: 'offers', label: 'Available Offers', value: offers_count.toString().padStart(2, '0'), icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', href: '/buyer/offer' },
                                        ].map((stat, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => {
                                                    if (stat.href) {
                                                        window.location.href = stat.href;
                                                    } else {
                                                        setActiveTab(stat.id);
                                                    }
                                                }}
                                                className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm group hover:border-[#d4af37]/30 transition-all cursor-pointer"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                                                <p className="text-3xl font-light text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Personal Information — High Fidelity Tech Card */}
                                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 relative group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#d4af37]"></div>
                                        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.4em]">Section // Core Profile</span>
                                                    <div className="px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20">
                                                        <span className="text-[7px] font-black text-green-600 dark:text-green-400 uppercase">Synchronized</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-[0.1em] uppercase">Identity Overview</h3>
                                            </div>
                                            <button 
                                                onClick={() => setActiveTab('details')}
                                                className="px-8 py-3 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] dark:hover:bg-[#d4af37] dark:hover:text-white transition-all shadow-lg"
                                            >
                                                Configure Identity
                                            </button>
                                        </div>
                                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                                            {/* Technical Background Detail */}
                                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
                                                <span className="text-[200px] font-black uppercase tracking-tighter leading-none -rotate-12">IDENTITY</span>
                                            </div>

                                            {[
                                                { label: 'Full Identity Name', value: fullName, code: 'ID-01' },
                                                { label: 'Verified Channel', value: email, code: 'EM-02' },
                                                { label: 'Comms Uplink', value: phone, code: 'PH-03' },
                                                { label: 'Residence Axis', value: primaryAddress, code: 'AX-04' },
                                            ].map((info, i) => (
                                                <div key={i} className="space-y-3 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[8px] font-bold text-gray-400 dark:text-gray-600">{info.code}</span>
                                                        <div className="h-[1px] w-4 bg-[#d4af37]/30"></div>
                                                        <p className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.2em]">{info.label}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{info.value || 'NOT SET'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security & Preferences moved to Clerk Modal for Professionalism */}
                                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm p-8 flex items-center justify-between group hover:border-[#d4af37]/20 transition-all cursor-pointer" onClick={() => (window as any).Clerk?.openUserProfile()}>
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security & Account Settings</h3>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">Manage passwords, 2FA, and authentication methods formally via Clerk.</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-[#d4af37] group-hover:text-white transition-all">Open Settings</button>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="bg-red-50 dark:bg-red-500/5 rounded-3xl p-8 border border-red-100 dark:border-red-500/20 shadow-sm">
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 tracking-tight">Danger Zone</h3>
                                        <p className="text-sm text-red-600/60 dark:text-red-400/60 mt-1 mb-8 italic">Actions here are irreversible. Please proceed with utmost caution.</p>
                                        <button 
                                            onClick={handleTerminateAccount}
                                            className="px-8 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                                        >
                                            Terminate Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Activity Center</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">Real-time alerts and formal order status history</p>
                                        </div>
                                        {notifications.length > 0 && (
                                            <button 
                                                onClick={markAllAsRead}
                                                className="px-6 py-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-[#d4af37] rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 transition-all"
                                            >
                                                Archive All
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden">
                                        <div className="p-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                <div className="divide-y divide-gray-50 dark:divide-white/5">
                                                    {notifications.map((notif) => (
                                                        <div 
                                                            key={notif.id}
                                                            onClick={() => markAsRead(notif.id)}
                                                            className={`p-8 flex gap-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group relative ${!notif.is_read ? 'bg-amber-50/20 dark:bg-[#d4af37]/5' : ''}`}
                                                        >
                                                            {!notif.is_read && (
                                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#d4af37] rounded-r-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
                                                            )}
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                                                                notif.type === 'order' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30' :
                                                                notif.type === 'payment' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30' :
                                                                'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                                            }`}>
                                                                {notif.type === 'order' ? <Package className="w-6 h-6" /> : 
                                                                 notif.type === 'payment' ? <CreditCard className="w-6 h-6" /> : 
                                                                 <Tag className="w-6 h-6" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest group-hover:text-[#d4af37] transition-colors">{notif.title}</h4>
                                                                        {!notif.is_read && (
                                                                            <span className="flex h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse"></span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                                                                        {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                                    {notif.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-32 flex flex-col items-center text-center px-10">
                                                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                                                        <Bell className="w-8 h-8 text-gray-200 dark:text-gray-800" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Quiet in the Vault</h4>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-[280px]">Your artisanal activity history is clear. New updates will materialize here.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="px-10 py-6 bg-amber-50/50 dark:bg-amber-900/5 rounded-3xl border border-amber-100/50 dark:border-amber-900/20 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 font-bold uppercase tracking-widest">Note: Notifications are synchronized in real-time. Unread items are highlighted with the artisanal gold bar.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    {/* Professional Header - Matching Map Style */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-[#1a1a1a] dark:text-white uppercase tracking-[0.2em]">Account Configuration</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">Formal Identity & Secure Communication extraction</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">System: Operational</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-2 shadow-2xl shadow-black/5 border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        {/* Decorative Glassmorphism Elements */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[100px] -mr-32 -mt-32"></div>
                                        
                                        <form onSubmit={handleUpdateProfile} className="relative z-10 p-8 space-y-12">
                                            {/* Section: Personal Identity */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Identity Core // 01</span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Full Identity Name</label>
                                                            <span className="text-[8px] font-bold text-[#eca840]/60 uppercase tracking-tighter italic">Required Field</span>
                                                        </div>
                                                        <div className="relative group">
                                                            <input 
                                                                type="text" 
                                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl px-7 py-5 focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium text-sm group-hover:bg-white dark:group-hover:bg-black/40" 
                                                                value={fullName}
                                                                onChange={(e) => setFullName(e.target.value)}
                                                                placeholder="Enter formal name..."
                                                            />
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Official Email Address</label>
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                                                                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                                <span className="text-[7px] font-black uppercase text-blue-500">Verified Sync</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative group">
                                                            <input 
                                                                type="email" 
                                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl px-7 py-5 focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium text-sm group-hover:bg-white dark:group-hover:bg-black/40" 
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="name@domain.com"
                                                            />
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section: Logistics & Connectivity */}
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Logistics Node // 02</span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Verified Phone Number</label>
                                                        <div className="relative group">
                                                            <input 
                                                                type="tel" 
                                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl px-7 py-5 focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium text-sm group-hover:bg-white dark:group-hover:bg-black/40" 
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                placeholder="+63 000 000 0000"
                                                            />
                                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Primary Residence Axis</label>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/10 rounded-lg border border-[#d4af37]/20">
                                                                <div className="w-1 h-1 rounded-full bg-[#d4af37] animate-pulse"></div>
                                                                <span className="text-[7px] font-black uppercase text-[#d4af37]">GPS Ready</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative group">
                                                            <textarea 
                                                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl px-7 py-5 focus:ring-2 focus:ring-[#d4af37]/20 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium text-sm group-hover:bg-white dark:group-hover:bg-black/40 pr-14 resize-none min-h-[100px]" 
                                                                value={primaryAddress}
                                                                onChange={(e) => setPrimaryAddress(e.target.value)}
                                                                placeholder="Enter primary delivery address..."
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={handleDetectLocation}
                                                                disabled={isDetecting}
                                                                className={`absolute right-5 top-1/2 -translate-y-1/2 text-[#d4af37] hover:scale-110 transition-transform ${isDetecting ? 'opacity-50 animate-pulse' : ''}`}
                                                                title="Detect Location"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Artisanal Map Integration & Verification Hub */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Precision Mapping & Verification Hub</label>
                                                    {isLocationVerified && (
                                                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                            <span className="text-[8px] font-black uppercase tracking-widest">Verified Precise</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative h-64 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-inner bg-gray-50 dark:bg-white/5">
                                                    <div 
                                                        ref={mapRef} 
                                                        className="w-full h-full block"
                                                        style={{ zIndex: 10 }}
                                                    />
                                                    {!detectedCoords && (
                                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-100 dark:border-white/10 shadow-lg flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Map Initialized — Awaiting Detection</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Map Overlay for Glassmorphism feel */}
                                                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 dark:border-white/5 rounded-[2rem] z-20"></div>
                                                </div>
                                                <div className="flex items-center gap-4 p-5 bg-[#d4af37]/5 rounded-2xl border border-[#d4af37]/20">
                                                    <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </div>
                                                    <p className="text-[9px] text-[#d4af37] font-bold leading-relaxed uppercase tracking-wider">Our verification hub ensures your accurate location is synchronized for the most premium delivery experience.</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                                                <button 
                                                    type="submit"
                                                    className="w-full sm:w-auto px-10 py-4 bg-[#d4af37] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(212,175,55,0.2)] hover:-translate-y-1 active:translate-y-0 transition-all"
                                                >
                                                    Save Changes
                                                </button>
                                                
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsAddressModalOpen(true)}
                                                    className="w-full sm:w-auto px-10 py-4 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                                                >
                                                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                    Add Another Address
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                </div>

                {/* Formal Address Modal — Professional Editorial UI */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop with elegant blur */}
                        <div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setIsAddressModalOpen(false)}
                        ></div>
                        
                        {/* Modal Container */}
                        <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                            {/* Editorial Header */}
                            <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2 backdrop-blur-md">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Add Delivery Location</h3>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Specify your artisanal delivery requirements.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all border border-gray-100 dark:border-white/10 hover:scale-110 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Refined Form Content */}
                            <div className="p-8 sm:p-10 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">Location Label</label>
                                        <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none">
                                            <option>Home Residence</option>
                                            <option>Professional Office</option>
                                            <option>Seasonal Retreat</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">Recipient Name</label>
                                        <input type="text" placeholder="Full legal name" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">Street Address</label>
                                    <div className="relative">
                                        <input type="text" placeholder="Building, street, and house number" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#d4af37]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">City</label>
                                        <input type="text" placeholder="Metro Manila" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">State / Province</label>
                                        <input type="text" placeholder="National Capital" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                    </div>
                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em] ml-1">Postal Code</label>
                                        <input type="text" placeholder="1000" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed uppercase tracking-wider">Note: This address will be verified by our logistics partners to ensure prompt artisanal delivery.</p>
                                </div>
                            </div>

                            {/* Professional Footer */}
                            <div className="p-8 sm:p-10 bg-gray-50/50 dark:bg-white/2 backdrop-blur-md flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-100 dark:border-white/5">
                                <button 
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsAddressModalOpen(false);
                                        setShowSuccess(true);
                                        setTimeout(() => setShowSuccess(false), 3000);
                                    }}
                                    className="px-12 py-4 bg-[#d4af37] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#d4af37]/20 hover:-translate-y-1 active:translate-y-0 transition-all"
                                >
                                    Add Address
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BuyerLayout>
    );
}
