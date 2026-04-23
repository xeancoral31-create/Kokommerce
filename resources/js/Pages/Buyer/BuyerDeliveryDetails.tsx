import React, { useState, useEffect, useRef } from 'react';
import BuyerLayout from '../../Components/BuyerLayout';
import { Head, Link } from '@inertiajs/inertia-react';
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
    const { cartItems, setItems, deliveryDetails, updateDeliveryDetails } = useCart();
    
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
    const [localName, setLocalName] = useState(deliveryDetails.receiverName);
    const [localPhone, setLocalPhone] = useState(deliveryDetails.contactNumber);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ ...deliveryDetails });

    // Map Refs
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Use global cart items if available, otherwise fallback to props
    const activeItems = cartItems.length > 0 ? cartItems : cart_items;
    const subtotal = activeItems.reduce((acc, item) => acc + (parseFloat(String(item.price)) * parseInt(String(item.qty))), 0);
    const deliveryValue = 20;
    const total = subtotal + deliveryValue;

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
            
            if (data && data.address) {
                const addr = data.address;
                
                // Create a much more descriptive "Full Landmark" string for accurate delivery
                const houseNumber = addr.house_number || "";
                const road = addr.road || "";
                const neighbourhood = addr.neighbourhood || addr.suburb || addr.village || "";
                const building = addr.building || addr.amenity || "";
                
                // Construct a detailed landmark/street string
                let detailedLandmark = [houseNumber, road, building].filter(Boolean).join(" ");
                if (!detailedLandmark) detailedLandmark = neighbourhood || "Unmarked Point";
                else if (neighbourhood) detailedLandmark += `, ${neighbourhood}`;

                const city = addr.city || addr.town || addr.municipality || "Butuan City";
                const state = addr.region || addr.state || "Agusan del Norte";
                const zip = addr.postcode || "8600";
                
                const recName = localName || deliveryDetails.receiverName || 'Artisanal Receiver';
                
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
        if ("geolocation" in navigator) {
            // High-precision options for "Accurate" detection
            const options = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    const newCoords: [number, number] = [latitude, longitude];
                    
                    // Update Map and Marker
                    setLocalCoords(newCoords);
                    if (mapRef.current) {
                        mapRef.current.flyTo(newCoords, 18, {
                            duration: 2.5,
                            easeLinearity: 0.25
                        });

                        // Visual accuracy circle
                        L.circle(newCoords, {
                            radius: accuracy, // Show real GPS accuracy radius
                            color: '#eca840',
                            fillColor: '#eca840',
                            fillOpacity: 0.15,
                            weight: 1
                        }).addTo(mapRef.current);
                    }

                    await updateAddressFromCoords(latitude, longitude);
                    setIsDetecting(false);
                    
                    // Show "Verified" toast-like UI feedback
                    const verifiedBadge = document.getElementById('accuracy-status');
                    if (verifiedBadge) {
                        verifiedBadge.innerText = `Accurate within ${Math.round(accuracy)}m`;
                        verifiedBadge.classList.add('text-green-500');
                    }
                },
                (error) => {
                    console.error("Detection Error:", error);
                    setIsDetecting(false);
                    const errorMessage = error.code === 1 ? "Location access denied. Please enable GPS." : "GPS Signal lost. Calibration failed.";
                    alert(errorMessage);
                },
                options
            );
        } else {
            setIsDetecting(false);
            alert("Geolocation is not supported by your browser.");
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
            <Head title="Logistics Destination - Kokommerce" />
            <div className="max-w-6xl mx-auto pb-20 px-4 mt-8">
                <header className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <Link href={route && route('buyer.cart')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#d4af37] transition-all group">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#fdfcf0]">
                                <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </div>
                            Return to Cart
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
                     <div className="lg:col-span-2 space-y-12">
                         {/* Destination Summary Card */}
                         <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:bg-blue-100/50 transition-colors duration-700"></div>
                             
                             <div className="relative flex justify-between items-start mb-16">
                                 <div>
                                     <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Logistics Destination</h2>
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80">High Precision Tracking</span>
                                     </div>
                                 </div>
                                 <div className="flex flex-col items-end gap-3">
                                     <div className="text-right">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Logistics</span>
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

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                                 <div className="space-y-10">
                                     <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Receiver Identity</p>
                                             <h3 className="text-2xl font-black text-slate-900 leading-tight">{localName || 'Loading...'}</h3>
                                             <p className="text-sm font-bold text-blue-600/80 mt-1">{localPhone || 'Not provided'}</p>
                                         </div>
                                     </div>

                                     <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-[#d4af37]">
                                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Landmark / Point</p>
                                             <h3 className="text-2xl font-black text-slate-900 leading-tight italic">{localLandmark || 'Loading...'}</h3>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col justify-center gap-6">
                                     <div className="flex justify-between items-center px-2">
                                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Zone / City</span>
                                         <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{localCity || 'Loading...'}</span>
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

                             <div className="mt-12 pt-10 border-t border-gray-50 flex items-center gap-4">
                                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                 <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
                                     Precision location detected: <span className="text-slate-900 font-black">{localAddress || 'Syncing global coordinates...'}</span>
                                 </p>
                             </div>
                         </div>

                         {/* Mapping Section */}
                         <section className="space-y-10">
                             <div className="flex justify-between items-end px-12">
                                 <div>
                                     <h3 className="text-3xl font-black tracking-tight uppercase">Map Pinpoint</h3>
                                     <p className="text-gray-400 font-bold mt-2 italic">Precision GPS calibration for artisanal delivery.</p>
                                 </div>
                                 <button 
                                    onClick={handleDetectLocation}
                                    disabled={isDetecting}
                                    className="bg-slate-900 text-white rounded-[2rem] px-10 py-5 text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4 group"
                                 >
                                     <svg className={`w-4 h-4 ${isDetecting ? 'animate-spin' : 'group-hover:animate-bounce'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                     </svg>
                                     {isDetecting ? 'Calibrating Satellite...' : 'Detect location now'}
                                 </button>
                             </div>
                             
                             <div className="h-[600px] rounded-[4.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative z-10 border-[16px] border-white ring-1 ring-black/5 bg-slate-50">
                                 {/* Map Container Ref */}
                                 <div ref={mapContainerRef} className="w-full h-full" />

                                 {/* Accuracy Overlay */}
                                 <div className="absolute bottom-10 left-10 right-10 z-[1000] flex justify-center">
                                     <div className="bg-slate-900/95 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-10 border border-white/10 w-full max-w-2xl">
                                         <div className="flex flex-col flex-1">
                                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">GPS Calibration</span>
                                             <span id="accuracy-status" className="text-sm font-black text-[#d4af37] uppercase tracking-widest mt-1">Satellite Precision</span>
                                         </div>
                                         <div className="h-10 w-[1px] bg-white/20"></div>
                                         <div className="flex flex-col flex-1">
                                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Network Status</span>
                                             <span className="text-sm font-black text-blue-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                Verified Hub
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                                             </span>
                                         </div>
                                         <div className="h-10 w-[1px] bg-white/20"></div>
                                         <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Region</span>
                                            <span className="text-sm font-black uppercase tracking-widest mt-1 italic">Butuan 8600</span>
                                         </div>
                                     </div>
                                 </div>

                                 {isDetecting && (
                                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[2000] flex flex-col items-center justify-center">
                                         <div className="w-16 h-16 border-4 border-slate-900 border-t-[#d4af37] rounded-full animate-spin mb-6"></div>
                                         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">GPS Calibration Active</p>
                                     </div>
                                 )}
                             </div>
                         </section>
                     </div>

                     {/* Summary Sidebar */}
                     <div className="space-y-8">
                         <div className="bg-[#1a1a1a] rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] translate-x-16 -translate-y-16 rotate-45 opacity-20"></div>
                             
                             <h2 className="text-2xl font-black mb-10 tracking-tight italic">Acquisition Summary</h2>
                             <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide mb-10 pb-10 border-b border-white/10">
                                 {activeItems.map((item: any) => (
                                     <div key={item.id} className="flex gap-5">
                                         <img src={item.img} className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/10" alt={item.name} />
                                         <div className="flex-grow">
                                             <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-[10px] leading-tight max-w-[120px] uppercase tracking-wider">{item.name}</h4>
                                                <span className="text-[#d4af37] font-black text-xs">₱{(item.price * item.qty).toLocaleString()}</span>
                                             </div>
                                             <p className="text-[9px] text-white/40 mt-2 font-black uppercase tracking-[0.2em]">Qty: {item.qty}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             <div className="space-y-6 pb-12 border-b border-white/10">
                                 <div className="flex justify-between items-center">
                                     <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                                     <span className="text-xl font-black tracking-tight">₱{subtotal.toLocaleString()}.00</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Logistics</span>
                                     <span className="text-xl font-black tracking-tight">₱{deliveryValue.toLocaleString()}.00</span>
                                 </div>
                             </div>

                             <div className="pt-12 mb-12 flex justify-between items-end">
                                 <div>
                                     <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Total Payable</p>
                                     <p className="text-gray-400 text-[10px] font-medium leading-none italic">Secure Transaction</p>
                                 </div>
                                 <p className="text-5xl font-black tracking-tighter text-[#d4af37]">₱{total.toLocaleString()}</p>
                             </div>

                             <Link 
                                href={route && route('buyer.payment')}
                                className="w-full py-6 mt-10 bg-[#d4af37] text-white rounded-full text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center transition-all hover:bg-white hover:text-slate-900 active:scale-95 shadow-2xl shadow-black/40"
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
                     <div className="relative bg-white w-full max-w-[800px] rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                         <div className="p-12">
                             <div className="flex justify-between items-center mb-10">
                                 <div>
                                     <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modify Logistics</h2>
                                     <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Manual override active</p>
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
                                     Save Logistics Identity
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
