import React, { useState, useEffect, useRef } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import L from 'leaflet';
import { useCart } from '../../Context/CartContext';


// Fix for Leaflet default icon issues in bundled environments
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BuyerDeliveryDetailsProps {
    cart_items: any[];
}

export default function BuyerDeliveryDetails({ cart_items }: BuyerDeliveryDetailsProps) {
    const { props } = usePage();
    const authUser = (props.auth_user as any) || null;
    const { cartItems, setItems, deliveryDetails, updateDeliveryDetails, appliedVoucher, setIsDetectingLocation } = useCart();
    
    // States
    const [isDetecting, setIsDetecting] = useState(false);
    const [localCoords, setLocalCoords] = useState<[number, number]>(
        deliveryDetails.latitude && deliveryDetails.longitude 
        ? [deliveryDetails.latitude, deliveryDetails.longitude] 
        : [8.9475, 125.5406]
    );
    
    // Local UI State (Synced with CartContext)
    const [localAddress, setLocalAddress] = useState(deliveryDetails.address);
    const [localLandmark, setLocalLandmark] = useState(deliveryDetails.landmark);
    const [localCity, setLocalCity] = useState(deliveryDetails.city);
    const [localState, setLocalState] = useState(deliveryDetails.state);
    const [localZip, setLocalZip] = useState(deliveryDetails.zip);
    const [localName, setLocalName] = useState(deliveryDetails.receiverName || authUser?.name || '');
    const [localPhone, setLocalPhone] = useState(deliveryDetails.contactNumber);

    // Connect and Detect: Sync with Profile Name if authenticated
    useEffect(() => {
        if (authUser && authUser.name) {
            // If currently using a placeholder or empty, auto-detect profile name
            if (!deliveryDetails.receiverName || deliveryDetails.receiverName === 'Xean Coral' || deliveryDetails.receiverName === 'Identity Required') {
                setLocalName(authUser.name);
                updateDeliveryDetails({ receiverName: authUser.name });
                setEditForm(prev => ({ ...prev, receiverName: authUser.name }));
            }
        }
    }, [authUser, deliveryDetails.receiverName]);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ 
        ...deliveryDetails,
        receiverName: deliveryDetails.receiverName || authUser?.name || ''
    });

    // Map Refs
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Use global cart items if available, otherwise fallback to props
    const activeItems = cartItems.length > 0 ? cartItems : cart_items;
    
    // Calculate item-specific discounts for the total
    const discountAmount = activeItems.reduce((acc, item) => {
        if (appliedVoucher && item.id === appliedVoucher.product_id) {
            if (appliedVoucher.type === 'percentage') {
                return acc + (item.price * item.qty * (appliedVoucher.discount_value / 100));
            } else {
                return acc + (appliedVoucher.discount_value);
            }
        }
        return acc;
    }, 0);

    const subtotal = activeItems.reduce((acc, item) => acc + (parseFloat(String(item.price)) * parseInt(String(item.qty))), 0);
    const deliveryValue = 20;
    const total = subtotal + deliveryValue - discountAmount;

    // Initialize cart items if needed
    useEffect(() => {
        if (cartItems.length === 0 && cart_items && cart_items.length > 0) {
            setItems(cart_items);
        }
    }, [cart_items, cartItems.length, setItems]);

    // Initialize Map (Standard Leaflet)
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView(localCoords, 18);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);

            // Add draggable marker
            markerRef.current = L.marker(localCoords, { draggable: true }).addTo(mapRef.current);

            // Marker Drag Event
            markerRef.current.on('dragend', (e: L.LeafletEvent) => {
                const marker = e.target as L.Marker;
                const position = marker.getLatLng();
                const newCoords: [number, number] = [position.lat, position.lng];
                setLocalCoords(newCoords);
                updateAddressFromCoords(position.lat, position.lng);
            });

            // Map Click Event
            mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;
                const newCoords: [number, number] = [lat, lng];
                setLocalCoords(newCoords);
                if (markerRef.current) markerRef.current.setLatLng(e.latlng);
                updateAddressFromCoords(lat, lng);
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Effect to update map view when localCoords changes
    useEffect(() => {
        if (mapRef.current && markerRef.current) {
            mapRef.current.setView(localCoords, mapRef.current.getZoom());
            markerRef.current.setLatLng(localCoords);
        }
    }, [localCoords]);

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

                // Nominatim's display_name provides the most accurate and specific hierarchy.
                // We'll take the first two specific parts (e.g., "BRY Resettlement Project, Lower Doongan")
                if (data.display_name) {
                    const parts = data.display_name.split(',').map((p: string) => p.trim());
                    // Filter out city/state parts to just get the local landmark points
                    const localParts = parts.filter((p: string) => p !== city && p !== state && p !== zip && p !== "Philippines");
                    // Take the first two highly specific location names
                    const uniqueLocalParts = Array.from(new Set([localParts[0], localParts[1]])).filter(Boolean);
                    if (uniqueLocalParts.length > 0) {
                        detailedLandmark = uniqueLocalParts.join(', ');
                        
                        // Patch known OpenStreetMap boundary inaccuracies for Butuan
                        // The map categorizes BXU Resettlement Project under Ambago, but locally it is Upper Doongan.
                        if (detailedLandmark.includes("BXU Resettlement Project")) {
                            detailedLandmark = detailedLandmark.replace("Ambago", "Upper Doongan");
                        }
                    }
                }
                
                // Fallback to name if display_name somehow failed
                if (detailedLandmark === "Unknown Location" && data.name) {
                    detailedLandmark = data.name;
                }

                // High-precision formulated address
                const formulatedAddr = `${detailedLandmark}, ${city}, ${state} ${zip}`;

                // Update Local UI
                setLocalLandmark(detailedLandmark);
                setLocalAddress(formulatedAddr);
                setLocalCity(city);
                setLocalState(state);
                setLocalZip(zip);

                // Update Global Context
                updateDeliveryDetails({
                    ...deliveryDetails,
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
        setIsDetecting(true);
        setIsDetectingLocation(true);
        
        // Initial feedback in the precision HUD
        const verifiedBadge = document.getElementById('accuracy-status');
        if (verifiedBadge) {
            verifiedBadge.innerText = "Synchronizing Satellites...";
            verifiedBadge.classList.remove('text-green-400', 'text-red-400');
            verifiedBadge.classList.add('text-[#d4af37]');
        }

        if ("geolocation" in navigator) {
            let bestAccuracy = Infinity;
            let attempts = 0;
            const maxAttempts = 3;

            const options = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };

            // Use watchPosition for a short burst to obtain the most stable and accurate lock
            const watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    attempts++;
                    
                    const newCoords: [number, number] = [latitude, longitude];

                    // Only update if accuracy has improved or we have a solid lock
                    if (accuracy < bestAccuracy) {
                        bestAccuracy = accuracy;
                        setLocalCoords(newCoords);
                        
                        if (mapRef.current) {
                            mapRef.current.flyTo(newCoords, 19, {
                                duration: 2,
                                easeLinearity: 0.15
                            });

                            // Remove old circles
                            mapRef.current.eachLayer((layer: any) => {
                                if (layer instanceof L.Circle) {
                                    mapRef.current?.removeLayer(layer);
                                }
                            });

                            // Artisanal gold accuracy circle indicating real-time precision calibration
                            L.circle(newCoords, {
                                radius: accuracy, 
                                color: '#d4af37',
                                fillColor: '#d4af37',
                                fillOpacity: 0.1,
                                weight: 2,
                                dashArray: '8, 8',
                                className: 'animate-pulse'
                            }).addTo(mapRef.current);
                        }

                        await updateAddressFromCoords(latitude, longitude);
                        
                        if (verifiedBadge) {
                            verifiedBadge.innerText = `Satellite Refined: Within ${Math.round(accuracy)}m`;
                        }
                    }

                    // Stop if we reach high precision (under 15m) or maximum attempts
                    if (accuracy <= 15 || attempts >= maxAttempts) {
                        navigator.geolocation.clearWatch(watchId);
                        setIsDetecting(false);
                        setIsDetectingLocation(false);
                        if (verifiedBadge) {
                            verifiedBadge.classList.remove('text-[#d4af37]');
                            verifiedBadge.classList.add('text-green-400');
                            verifiedBadge.innerText = `Verified: ${Math.round(accuracy)}m Precision`;
                        }
                    }
                },
                (error) => {
                    console.error("GPS Error:", error);
                    setIsDetecting(false);
                    setIsDetectingLocation(false);
                    navigator.geolocation.clearWatch(watchId);
                    
                    if (verifiedBadge) {
                        verifiedBadge.classList.remove('text-[#d4af37]');
                        verifiedBadge.classList.add('text-red-400');
                        verifiedBadge.innerText = error.code === 1 ? "GPS Permission Denied" : "Weak Satellite Signal";
                    }
                },
                options
            );

            // Safety failsafe
            setTimeout(() => {
                navigator.geolocation.clearWatch(watchId);
                setIsDetecting(false);
            }, 20000);
            
        } else {
            setIsDetecting(false);
            alert("Geolocation services are not supported by this terminal.");
        }
    };

    const handleSaveManualEdit = () => {
        const fullAddress = `${editForm.receiverName || 'Receiver Identity'}, ${editForm.landmark || 'Landmark / Point'}, ${editForm.city || 'Zone / City'}, ${editForm.state || 'Region'}, ${editForm.zip || 'Postal Index'}`;

        setLocalName(editForm.receiverName);
        setLocalPhone(editForm.contactNumber);
        setLocalAddress(fullAddress);
        setLocalLandmark(editForm.landmark);
        setLocalCity(editForm.city);
        setLocalState(editForm.state);
        setLocalZip(editForm.zip);
        
        updateDeliveryDetails({ ...editForm, address: fullAddress });
        setIsEditModalOpen(false);
    };

    // Helper for route
    const route = (window as any).route;

    return (
        <BuyerLayout>
            <Head title="Delivery details & fee - Kokommerce" />
            <div className="max-w-6xl mx-auto pb-24 px-6 mt-16 md:mt-24">
                <header className="mb-16">
                    <div className="mb-10">
                        <Link 
                            href="/buyer/cart" 
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all duration-300 active:scale-95 group shadow-sm"
                        >
                            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Selection
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                        <span className="text-gray-200">01. Selection</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-[#d4af37]">02. Delivery</span>
                        <span className="w-8 h-[1px] bg-gray-200"></span>
                        <span className="text-gray-400 opacity-30">03. Payment</span>
                    </div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic">
                        Set Delivery <span className="text-[#d4af37]">Point.</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Pinpoint exactly where your artisanal orders should land.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#2d2a26]">
                     <div className="lg:col-span-2 space-y-8">
                         {/* Destination Summary Card */}
                         <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -translate-y-24 translate-x-24 group-hover:bg-blue-100/50 transition-colors duration-700"></div>
                             
                             <div className="relative flex justify-between items-start mb-8">
                                 <div>
                                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-3">Delivery details & fee</h2>
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80">High Precision Tracking</span>
                                     </div>
                                 </div>
                                 <div className="flex flex-col items-end gap-3">
                                     <div className="text-right">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Delivery Fee</span>
                                        <span className="text-xs font-black text-slate-900 uppercase mt-1 block flex items-center gap-2">
                                            Verified Hub 
                                            <svg className="w-3 h-3 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        </span>
                                     </div>
                                     <button 
                                        onClick={() => {
                                            setEditForm({ ...deliveryDetails });
                                            setIsEditModalOpen(true);
                                        }}
                                        className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#d4af37] transition-all flex items-center gap-3 active:scale-95 z-10"
                                     >
                                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.364l-4 1 1-4L17.632 3.632z" /></svg>
                                         Edit info
                                     </button>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                 <div className="space-y-6">
                                     <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                         </div>
                                         <div>
                                             <div className="flex items-center gap-2 mb-1">
                                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Receiver Identity</p>
                                                 {authUser && localName === authUser.name && (
                                                     <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter border border-blue-100">
                                                         <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                         Verified Account
                                                     </span>
                                                 )}
                                             </div>
                                             <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{localName || 'Identity Required'}</h3>
                                             <p className="text-[11px] font-black text-blue-600/60 mt-2 uppercase tracking-widest">{localPhone || 'Contact details pending'}</p>
                                         </div>
                                     </div>

                                     <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#d4af37]">
                                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Landmark / Point</p>
                                             <h3 className="text-lg font-bold text-slate-900 leading-tight italic">{localLandmark || 'Loading...'}</h3>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center gap-4 h-fit self-center">
                                     <div className="flex justify-between items-center px-2">
                                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Zone / City</span>
                                         <span className="text-xs font-bold text-slate-900 tracking-tight">{localCity || 'Loading...'}</span>
                                     </div>
                                     <div className="flex justify-between items-center px-2">
                                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Region</span>
                                         <span className="text-xs font-black text-slate-700">{localState || 'Loading...'}</span>
                                     </div>
                                     <div className="flex justify-between items-center px-2">
                                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Postal Index</span>
                                         <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-xl border border-blue-100/30">{localZip || '8600'}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                     Precision location detected: <span className="text-slate-900 font-bold">{localAddress || 'Syncing global coordinates...'}</span>
                                 </p>
                             </div>
                         </div>

                         {/* Mapping Section */}
                         <section className="space-y-8">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
                                 <div>
                                     <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 leading-none">Map Pinpoint</h3>
                                     <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-[0.2em] italic">High-Precision GPS Extraction</p>
                                 </div>
                                 <button 
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                    className="relative overflow-hidden bg-slate-900 border border-slate-900 text-white rounded-xl px-10 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4 group"
                                 >
                                     <div className="absolute inset-0 bg-[#d4af37]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                     <svg className={`relative w-4 h-4 transition-transform duration-500 ${isDetecting ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                     </svg>
                                     <span className="relative">{isDetecting ? 'Synchronizing Satellites...' : 'Detect Precise Point'}</span>
                                 </button>
                             </div>
                             
                             <div className="h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white ring-1 ring-black/10 bg-slate-100 group">
                                 {/* Map Container Ref */}
                                 <div ref={mapContainerRef} className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" />

                                 {/* GPS HUB Overlay - Professional Console Style */}
                                 <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-4 pointer-events-none max-w-xs">
                                     <div className={`transition-all duration-1000 transform ${isDetecting ? 'translate-y-0 opacity-100' : 'translate-x-0 opacity-90 hover:opacity-100'}`}>
                                         <div className="bg-slate-900/95 border-l-4 border-[#d4af37] p-5 backdrop-blur-2xl flex flex-col gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                             <div className="flex items-center gap-3">
                                                 <div className="relative">
                                                     <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full" />
                                                     <div className="absolute inset-0 w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-ping" />
                                                 </div>
                                                 <span className="text-[#d4af37] font-black uppercase tracking-[0.4em] text-[9px]">Logistics Core // Verified</span>
                                             </div>
                                             
                                             <div className="flex flex-col gap-1">
                                                 <span id="accuracy-status" className="text-white font-serif text-xl italic tracking-tight leading-tight">
                                                     Ready for Calibration
                                                 </span>
                                                 <div className="flex items-center gap-1 mt-2">
                                                     <div className={`h-1 flex-1 bg-white/5 rounded-full overflow-hidden`}>
                                                         <div className={`h-full bg-[#d4af37] rounded-full ${isDetecting ? 'animate-[loading_2s_ease-in-out_infinite]' : 'w-full opacity-30 transition-all duration-1000'}`} />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="bg-black/80 border border-white/10 px-5 py-3 backdrop-blur-md inline-flex items-center gap-3 rounded-full">
                                         <div className={`w-2 h-2 rounded-full ${localCoords ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' : 'bg-red-500'}`} />
                                         <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">
                                             Signal: {localCoords ? 'Optimized' : 'Searching'}
                                         </span>
                                     </div>
                                 </div>

                                 {/* Metadata HUD */}
                                 <div className="absolute top-8 right-8 z-[1000] pointer-events-none hidden md:block">
                                     <div className="bg-slate-900/90 border border-white/5 p-6 backdrop-blur-xl rounded-2xl shadow-2xl w-56 transform hover:scale-105 transition-transform duration-500">
                                         <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                                             <span className="text-gray-400 text-[10px] font-black tracking-widest uppercase">Coordinates</span>
                                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_3s_infinite]" />
                                         </div>
                                         <div className="space-y-3">
                                             <div className="flex flex-col gap-1">
                                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Lat. Axis</span>
                                                 <span className="text-white font-mono text-xs tracking-wider">{localCoords[0].toFixed(7)}</span>
                                             </div>
                                             <div className="flex flex-col gap-1">
                                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Lng. Axis</span>
                                                 <span className="text-white font-mono text-xs tracking-wider">{localCoords[1].toFixed(7)}</span>
                                             </div>
                                             <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                                                 <div className="p-1.5 bg-[#d4af37]/10 rounded-lg">
                                                     <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                     </svg>
                                                 </div>
                                                 <span className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] leading-tight">Secure Pinpoint // Encrypted</span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Accuracy Visual Circle Toast */}
                                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
                                     <div className="bg-[#d4af37] text-black px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center gap-4 border-2 border-white">
                                         <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">Accuracy Matrix: Active</span>
                                     </div>
                                 </div>

                                 {isDetecting && (
                                     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-[2000] flex flex-col items-center justify-center pointer-events-all">
                                         <div className="relative">
                                             <div className="w-24 h-24 border-2 border-[#d4af37]/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                             <div className="absolute inset-2 border-t-4 border-[#d4af37] rounded-full animate-spin"></div>
                                             <div className="absolute inset-6 border-b-2 border-white/50 rounded-full animate-[reverse-spin_1.5s_linear_infinite]"></div>
                                         </div>
                                         <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] mt-10 animate-pulse">Scanning Global Grid...</p>
                                     </div>
                                 )}
                             </div>
                         </section>
                     </div>

                     {/* Summary Sidebar */}
                     <div className="space-y-8">
                         <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37] translate-x-12 -translate-y-12 rotate-45 opacity-20"></div>
                             
                             <h2 className="text-xl font-bold mb-8 tracking-tight italic">Acquisition Summary</h2>
                             <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide mb-8 pb-8 border-b border-white/10">
                                 {activeItems.map((item: any) => (
                                     <div key={item.id} className="flex gap-4">
                                         <img src={item.img} className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10" alt={item.name} />
                                         <div className="flex-grow">
                                             <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[10px] leading-tight max-w-[120px] uppercase tracking-wider">{item.name}</h4>
                                                <span className={`font-bold text-[11px] ${appliedVoucher && item.id === appliedVoucher.product_id ? 'text-green-400' : 'text-[#d4af37]'}`}>
                                                    ₱{(item.price * item.qty - (appliedVoucher && item.id === appliedVoucher.product_id ? (appliedVoucher.type === 'percentage' ? (item.price * item.qty * (appliedVoucher.discount_value / 100)) : appliedVoucher.discount_value) : 0)).toLocaleString()}
                                                </span>
                                             </div>
                                             {appliedVoucher && item.id === appliedVoucher.product_id && (
                                                 <p className="text-[8px] text-green-500/40 font-bold uppercase tracking-widest line-through">₱{(item.price * item.qty).toLocaleString()}</p>
                                             )}
                                             <p className="text-[9px] text-white/40 mt-1 font-bold uppercase tracking-widest">Qty: {item.qty}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             <div className="space-y-4 pb-8 border-b border-white/10">
                                 <div className="flex justify-between items-center">
                                     <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                                     <span className="text-sm font-bold tracking-tight">₱{subtotal.toLocaleString()}.00</span>
                                 </div>
                                 {discountAmount > 0 && (
                                     <div className="flex justify-between items-center">
                                         <span className="text-green-500/60 text-[10px] font-bold uppercase tracking-widest">Discount</span>
                                         <span className="text-sm font-bold tracking-tight text-green-400">- ₱{discountAmount.toLocaleString()}.00</span>
                                     </div>
                                 )}
                                 <div className="flex justify-between items-center">
                                     <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Delivery Fee</span>
                                     <span className="text-sm font-bold tracking-tight">₱{deliveryValue.toLocaleString()}.00</span>
                                 </div>
                             </div>

                             <div className="pt-8 mb-8 flex justify-between items-end">
                                 <div>
                                     <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1 leading-none">Total Payable</p>
                                     <p className="text-gray-400 text-[10px] font-medium leading-none italic">Secure Transaction</p>
                                 </div>
                                 <p className="text-3xl font-bold tracking-tighter text-[#d4af37]">₱{total.toLocaleString()}</p>
                             </div>

                             <Link 
                                onClick={() => {
                                    // Save state if needed, but Context handles it
                                }}
                                href="/buyer/payment"
                                className="w-full py-4 mt-6 bg-[#d4af37] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all hover:bg-white hover:text-slate-900 active:scale-95 shadow-md"
                             >
                                Confirm & Pay Now
                             </Link>
                         </div>
                     </div>
                </div>
            </div>

            {/* Edit Modal (Manual Override) */}
            {isEditModalOpen && (
                 <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
                     <div className="relative bg-white w-full max-w-[600px] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                         <div className="p-8">
                             <div className="flex justify-between items-center mb-8">
                                 <div>
                                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Modify Delivery</h2>
                                     <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Manual override active</p>
                                 </div>
                                 <button onClick={() => setIsEditModalOpen(false)} className="text-gray-300 hover:text-slate-900 bg-gray-50 rounded-full p-2">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {/* Receiver Identity */}
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Receiver Identity</label>
                                     <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        value={editForm.receiverName}
                                        onChange={(e) => setEditForm({...editForm, receiverName: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact Number</label>
                                     <input 
                                        type="text" 
                                        placeholder="e.g. +63 900 000 0000"
                                        value={editForm.contactNumber}
                                        onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all"
                                     />
                                 </div>
                                 
                                 {/* Map Details split into 4 distinct fields */}
                                 <div className="col-span-1 md:col-span-2 space-y-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Landmark / Point</label>
                                     <input 
                                        type="text" 
                                        placeholder="Street, Building, or famous landmark"
                                        value={editForm.landmark}
                                        onChange={(e) => setEditForm({...editForm, landmark: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all"
                                     />
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Zone / City</label>
                                     <input 
                                        type="text" 
                                        placeholder="City or Municipality"
                                        value={editForm.city}
                                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all"
                                     />
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Region</label>
                                     <input 
                                        type="text" 
                                        placeholder="Province or Region"
                                        value={editForm.state}
                                        onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all"
                                     />
                                 </div>

                                 <div className="space-y-2 col-span-1 md:col-span-2">
                                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Postal Index</label>
                                     <input 
                                        type="text" 
                                        placeholder="e.g. 8600"
                                        value={editForm.zip}
                                        onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#d4af37] transition-all md:w-1/2"
                                     />
                                 </div>
                             </div>

                             <div className="mt-12 flex gap-4">
                                  <button 
                                    onClick={handleSaveManualEdit}
                                    className="flex-grow py-6 bg-[#d4af37] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black transition-colors"
                                 >
                                     Save Delivery Information
                                 </button>
                                 <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-10 py-6 bg-slate-100 text-gray-500 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                 >
                                     Cancel
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
            )}
        </BuyerLayout>
    );
}
